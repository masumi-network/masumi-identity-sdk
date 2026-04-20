import { describe, expect, it } from "vitest";

import type { Credential } from "../../src/types.js";
import {
  extractCredentialAttributes,
  findCredentialBySchema,
  formatCredential,
  validateCredential,
} from "../../src/utils/credentials.js";

function makeCredential(overrides: Partial<Credential> = {}): Credential {
  return {
    sad: {
      d: "ECREDSAID",
      s: "ESCHEMASAID",
      i: "EISSUER",
      a: {
        i: "EHOLDER",
        dt: new Date().toISOString(),
        agentId: "agent-1",
        role: "verified",
      },
      ri: "EREGISTRY",
    },
    schema: {
      $id: "ESCHEMASAID",
      credentialType: "AgentVerification",
      title: "Agent Verification",
    },
    status: { s: "0" },
    ...overrides,
  };
}

describe("extractCredentialAttributes", () => {
  it("returns only non-metadata attributes", () => {
    const attrs = extractCredentialAttributes(makeCredential());
    expect(attrs).toEqual({ agentId: "agent-1", role: "verified" });
  });

  it("handles missing attribute block", () => {
    const credential = makeCredential();
    credential.sad.a = { i: "EHOLDER", dt: "2026-01-01T00:00:00.000Z" };
    expect(extractCredentialAttributes(credential)).toEqual({});
  });
});

describe("validateCredential", () => {
  it("returns issued for a fresh, active credential", () => {
    const result = validateCredential(makeCredential());
    expect(result.isValid).toBe(true);
    expect(result.status).toBe("issued");
  });

  it("returns revoked when status code is 1", () => {
    const result = validateCredential(
      makeCredential({ status: { s: "1", et: "rev", dt: "2026-04-01T00:00:00Z" } }),
    );
    expect(result.isValid).toBe(false);
    expect(result.status).toBe("revoked");
  });

  it("returns revoked when a rev block is present", () => {
    const result = validateCredential(
      makeCredential({
        status: { s: "0" },
        rev: { s: "1", dt: "2026-04-10T00:00:00Z" },
      }),
    );
    expect(result.isValid).toBe(false);
    expect(result.status).toBe("revoked");
    expect(result.details?.revokedAt).toBe("2026-04-10T00:00:00Z");
  });

  it("returns expired for a credential older than expirationDays", () => {
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000);
    const credential = makeCredential();
    credential.sad.a.dt = twoYearsAgo.toISOString();
    const result = validateCredential(credential, { expirationDays: 365 });
    expect(result.isValid).toBe(false);
    expect(result.status).toBe("expired");
  });

  it("respects a custom expirationDays window", () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const credential = makeCredential();
    credential.sad.a.dt = thirtyDaysAgo.toISOString();
    const result = validateCredential(credential, { expirationDays: 7 });
    expect(result.status).toBe("expired");
  });
});

describe("formatCredential", () => {
  it("projects credential into a friendly shape", () => {
    const formatted = formatCredential(makeCredential());
    expect(formatted.schemaSaid).toBe("ESCHEMASAID");
    expect(formatted.credentialType).toBe("AgentVerification");
    expect(formatted.issueeAid).toBe("EHOLDER");
    expect(formatted.isValid).toBe(true);
    expect(formatted.status).toBe("issued");
    expect(formatted.attributes).toEqual({
      agentId: "agent-1",
      role: "verified",
    });
  });
});

describe("findCredentialBySchema", () => {
  it("finds a matching credential by SAID", () => {
    const a = makeCredential();
    const b = makeCredential({
      sad: { ...makeCredential().sad, s: "EOTHER" },
    });
    const found = findCredentialBySchema([a, b], "EOTHER");
    expect(found).toBe(b);
  });

  it("returns undefined when no match", () => {
    const found = findCredentialBySchema(
      [makeCredential()],
      "ENONE",
    );
    expect(found).toBeUndefined();
  });
});
