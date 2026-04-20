import { describe, expect, it, vi } from "vitest";

import { MasumiIdentity } from "../../src/client.js";

/**
 * Build a stub `fetch` that returns a queued sequence of responses.
 * Each call consumes one entry.
 */
function mockFetch(
  responses: Array<{ ok?: boolean; status?: number; body: unknown }>,
): typeof fetch & { calls: Array<{ url: string; init?: RequestInit }> } {
  const queue = [...responses];
  const calls: Array<{ url: string; init?: RequestInit }> = [];

  const impl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input.toString();
    calls.push({ url, init });
    const next = queue.shift();
    if (!next) throw new Error(`Unexpected fetch call to ${url}`);
    return {
      ok: next.ok ?? true,
      status: next.status ?? 200,
      statusText: "OK",
      json: async () => next.body,
      text: async () => JSON.stringify(next.body),
    } as Response;
  });

  return Object.assign(impl as unknown as typeof fetch, { calls });
}

function makeIdentity(fetchImpl: typeof fetch): MasumiIdentity {
  return new MasumiIdentity({
    credentialServerUrl: "https://cred.test",
    keriaUrl: "https://keria.test",
    fetch: fetchImpl,
  });
}

describe("MasumiIdentity.getIssuerOobi", () => {
  it("fetches and returns the OOBI string", async () => {
    const fetchImpl = mockFetch([
      { body: { success: true, data: "http://issuer/oobi/EABC/agent" } },
    ]);
    const identity = makeIdentity(fetchImpl);
    const oobi = await identity.getIssuerOobi();
    expect(oobi).toBe("http://issuer/oobi/EABC/agent");
    expect(fetchImpl.calls[0]?.url).toBe("https://cred.test/keriOobi");
  });

  it("throws on a non-2xx response", async () => {
    const fetchImpl = mockFetch([{ ok: false, status: 500, body: "boom" }]);
    const identity = makeIdentity(fetchImpl);
    await expect(identity.getIssuerOobi()).rejects.toThrow(/OOBI/);
  });
});

describe("MasumiIdentity.connectToAid", () => {
  it("POSTs the oobi to /resolveOobi", async () => {
    const fetchImpl = mockFetch([{ body: { success: true, data: "ok" } }]);
    const identity = makeIdentity(fetchImpl);
    const result = await identity.connectToAid("http://wallet/oobi/EABC/agent");
    expect(result.success).toBe(true);
    const call = fetchImpl.calls[0]!;
    expect(call.url).toBe("https://cred.test/resolveOobi");
    expect(call.init?.method).toBe("POST");
    expect(JSON.parse(String(call.init?.body))).toEqual({
      oobi: "http://wallet/oobi/EABC/agent",
    });
  });

  it("rejects empty oobi", async () => {
    const fetchImpl = mockFetch([]);
    const identity = makeIdentity(fetchImpl);
    await expect(identity.connectToAid("")).rejects.toThrow(/oobi/);
  });
});

describe("MasumiIdentity.isAidConnected", () => {
  it("returns true when the AID appears in the contacts list", async () => {
    const fetchImpl = mockFetch([
      { body: { success: true, data: [{ id: "EABC" }, { id: "EDEF" }] } },
    ]);
    const identity = makeIdentity(fetchImpl);
    expect(await identity.isAidConnected("EDEF")).toBe(true);
  });

  it("returns false when the AID is not present", async () => {
    const fetchImpl = mockFetch([
      { body: { success: true, data: [{ id: "EABC" }] } },
    ]);
    const identity = makeIdentity(fetchImpl);
    expect(await identity.isAidConnected("EZZZ")).toBe(false);
  });
});

describe("MasumiIdentity.issueCredential", () => {
  it("POSTs schema + aid + attributes", async () => {
    const fetchImpl = mockFetch([{ body: { success: true, data: "issued" } }]);
    const identity = makeIdentity(fetchImpl);
    await identity.issueCredential({
      schemaSaid: "ESCHEMA",
      aid: "EHOLDER",
      attributes: { agentId: "a-1" },
    });
    const call = fetchImpl.calls[0]!;
    expect(call.url).toBe("https://cred.test/issueAcdcCredential");
    expect(JSON.parse(String(call.init?.body))).toEqual({
      schemaSaid: "ESCHEMA",
      aid: "EHOLDER",
      attribute: { agentId: "a-1" },
    });
  });

  it("omits the attribute field when no attributes are provided", async () => {
    const fetchImpl = mockFetch([{ body: { success: true, data: "issued" } }]);
    const identity = makeIdentity(fetchImpl);
    await identity.issueCredential({ schemaSaid: "ESCHEMA", aid: "EHOLDER" });
    const body = JSON.parse(String(fetchImpl.calls[0]?.init?.body));
    expect(body).toEqual({ schemaSaid: "ESCHEMA", aid: "EHOLDER" });
    expect("attribute" in body).toBe(false);
  });
});

describe("MasumiIdentity.getCredentialsForAid", () => {
  it("returns credentials from the server", async () => {
    const fetchImpl = mockFetch([
      {
        body: {
          data: [
            {
              sad: {
                s: "ES",
                i: "EI",
                a: { i: "EA", dt: "2026-01-01T00:00:00Z" },
                ri: "ER",
              },
              status: { s: "0" },
            },
          ],
        },
      },
    ]);
    const identity = makeIdentity(fetchImpl);
    const credentials = await identity.getCredentialsForAid("EA");
    expect(credentials).toHaveLength(1);
    expect(fetchImpl.calls[0]?.url).toBe(
      "https://cred.test/contactCredentials?contactId=EA",
    );
  });
});

describe("MasumiIdentity.fetchKeyState", () => {
  it("extracts the first key from a multi-key array", async () => {
    const fetchImpl = mockFetch([
      { body: { k: ["DPubKey1==", "DPubKey2=="], other: "field" } },
    ]);
    const identity = makeIdentity(fetchImpl);
    const state = await identity.fetchKeyState("EAID");
    expect(state.k).toBe("DPubKey1==");
    expect(state.other).toBe("field");
  });

  it("handles a single string key", async () => {
    const fetchImpl = mockFetch([{ body: { k: "DPubKeyOnly==" } }]);
    const identity = makeIdentity(fetchImpl);
    const state = await identity.fetchKeyState("EAID");
    expect(state.k).toBe("DPubKeyOnly==");
  });

  it("throws when key state has no public key", async () => {
    const fetchImpl = mockFetch([{ body: { other: "stuff" } }]);
    const identity = makeIdentity(fetchImpl);
    await expect(identity.fetchKeyState("EAID")).rejects.toThrow(
      /public key/i,
    );
  });
});
