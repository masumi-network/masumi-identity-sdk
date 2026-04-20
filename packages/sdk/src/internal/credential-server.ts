import { z } from "zod";

import type { Credential, IssueCredentialParams } from "../types.js";

const contactsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({ id: z.string().optional() })),
});

interface CredentialServerResponse {
  data: Credential[];
}

/**
 * Thin HTTP client for the Masumi KERI credential server.
 *
 * Intentionally minimal. Not part of the public API — consumers should use
 * {@link ../client.MasumiIdentity} instead. Exposed internally so tests can
 * mock the transport.
 */
export class CredentialServerClient {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {
    if (!baseUrl || typeof baseUrl !== "string") {
      throw new TypeError("credentialServerUrl must be a non-empty string");
    }
  }

  /**
   * Fetch the issuer's OOBI. Share this with a wallet so it can establish
   * a connection back to the credential server.
   */
  async getIssuerOobi(): Promise<string> {
    const response = await this.fetchImpl(`${this.baseUrl}/keriOobi`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch issuer OOBI: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as { success: boolean; data: string };
    if (!data.success || !data.data) {
      throw new Error("Invalid response from credential server");
    }
    return data.data;
  }

  /**
   * Resolve an OOBI for an AID. Must be called before issuing credentials
   * so the credential server knows how to reach the recipient.
   */
  async resolveOobi(
    oobi: string,
  ): Promise<{ success: boolean; data: string }> {
    assertNonEmpty(oobi, "oobi");

    const response = await this.fetchImpl(`${this.baseUrl}/resolveOobi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oobi }),
    });

    if (!response.ok) {
      throw await buildHttpError(response, "resolve OOBI");
    }

    return (await response.json()) as { success: boolean; data: string };
  }

  /**
   * Check whether an AID is known to the credential server's contacts.
   */
  async contactExists(aid: string): Promise<boolean> {
    assertNonEmpty(aid, "aid");

    const response = await this.fetchImpl(`${this.baseUrl}/contacts`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw await buildHttpError(response, "fetch contacts");
    }

    const raw: unknown = await response.json();
    const parsed = contactsResponseSchema.safeParse(raw);
    if (!parsed.success || !parsed.data.success) return false;
    return parsed.data.data.some((contact) => contact.id === aid);
  }

  /**
   * Fetch all credentials held by an AID.
   */
  async fetchCredentials(aid: string): Promise<Credential[]> {
    assertNonEmpty(aid, "aid");

    const url = `${this.baseUrl}/contactCredentials?contactId=${encodeURIComponent(aid)}`;
    const response = await this.fetchImpl(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw await buildHttpError(response, "fetch credentials");
    }

    const data = (await response.json()) as CredentialServerResponse;
    return data.data ?? [];
  }

  /**
   * Issue an ACDC credential to an AID.
   */
  async issueCredential(
    params: IssueCredentialParams,
  ): Promise<{ success: boolean; data: string }> {
    assertNonEmpty(params.schemaSaid, "schemaSaid");
    assertNonEmpty(params.aid, "aid");

    const body: {
      schemaSaid: string;
      aid: string;
      attribute?: Record<string, unknown>;
    } = {
      schemaSaid: params.schemaSaid,
      aid: params.aid,
    };
    if (params.attributes && Object.keys(params.attributes).length > 0) {
      body.attribute = params.attributes;
    }

    const response = await this.fetchImpl(
      `${this.baseUrl}/issueAcdcCredential`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) {
      throw await buildHttpError(response, "issue credential");
    }

    return (await response.json()) as { success: boolean; data: string };
  }
}

function assertNonEmpty(value: string, name: string): void {
  if (!value || typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`Invalid ${name}: must be a non-empty string`);
  }
}

async function buildHttpError(
  response: Response,
  action: string,
): Promise<Error> {
  const errorText = await response.text().catch(() => "Unknown error");
  let errorData: { data?: string } = {};
  try {
    errorData = JSON.parse(errorText) as { data?: string };
  } catch {
    // Non-JSON response body is fine; we fall back to the raw text.
  }
  return new Error(
    errorData.data ||
      `Failed to ${action}: ${response.status} ${response.statusText}. ${errorText}`,
  );
}
