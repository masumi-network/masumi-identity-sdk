import { CredentialServerClient } from "./internal/credential-server.js";
import { KeriClient } from "./internal/keri.js";
import type {
  AidKeyState,
  Credential,
  CredentialValidationOptions,
  CredentialValidationResult,
  FormattedCredential,
  IssueCredentialParams,
  MasumiIdentityConfig,
  VerifyAidSignatureParams,
} from "./types.js";
import {
  findCredentialBySchema as findCredentialBySchemaUtil,
  formatCredential as formatCredentialUtil,
  validateCredential as validateCredentialUtil,
} from "./utils/credentials.js";

/**
 * High-level client for Masumi Identity.
 *
 * Instantiate once per environment (per set of endpoint URLs) and reuse.
 *
 * @example
 * ```ts
 * import { MasumiIdentity } from "@masumi_network/identity-sdk";
 *
 * const identity = new MasumiIdentity({
 *   credentialServerUrl: "https://cred-issuance.masumi-identity.xyz",
 *   keriaUrl: "https://keria.masumi-identity.xyz",
 * });
 *
 * // Prove another agent owns the AID it claims
 * const ok = await identity.verifyAidSignature({
 *   aid: "EABC...",
 *   message: "hello",
 *   signature: "...",
 * });
 * ```
 */
export class MasumiIdentity {
  private readonly credentialServer: CredentialServerClient;
  private readonly keri: KeriClient;

  constructor(config: MasumiIdentityConfig) {
    const fetchImpl = config.fetch ?? fetch;
    this.credentialServer = new CredentialServerClient(
      config.credentialServerUrl,
      fetchImpl,
    );
    this.keri = new KeriClient(config.keriaUrl, fetchImpl);
  }

  // ==================================================================
  // Agent <-> AID linking
  // ==================================================================

  /**
   * Fetch the issuer's OOBI. Share this with a wallet so it can establish
   * a connection back to the credential server (the first half of the
   * agent-linking handshake).
   */
  async getIssuerOobi(): Promise<string> {
    return this.credentialServer.getIssuerOobi();
  }

  /**
   * Resolve an AID's OOBI at the credential server. Call this after the
   * wallet has shared its OOBI so the server can later issue credentials
   * to that AID.
   */
  async connectToAid(
    oobi: string,
  ): Promise<{ success: boolean; data: string }> {
    return this.credentialServer.resolveOobi(oobi);
  }

  /**
   * Check whether an AID is already a known contact of the credential server.
   * Returns `false` if the OOBI has not been resolved yet.
   */
  async isAidConnected(aid: string): Promise<boolean> {
    return this.credentialServer.contactExists(aid);
  }

  // ==================================================================
  // Verifiable Credential operations
  // ==================================================================

  /**
   * Issue an ACDC credential to an AID. The AID must have been connected
   * first via {@link connectToAid}.
   */
  async issueCredential(
    params: IssueCredentialParams,
  ): Promise<{ success: boolean; data: string }> {
    return this.credentialServer.issueCredential(params);
  }

  /**
   * Fetch all credentials currently held by an AID.
   */
  async getCredentialsForAid(aid: string): Promise<Credential[]> {
    return this.credentialServer.fetchCredentials(aid);
  }

  /**
   * Validate a credential's issuance status, revocation, and expiration.
   * Pure function — does not hit the network.
   */
  validateCredential(
    credential: Credential,
    options?: CredentialValidationOptions,
  ): CredentialValidationResult {
    return validateCredentialUtil(credential, options);
  }

  /**
   * Project a raw credential into a structured, display-friendly shape.
   * Pure function — does not hit the network.
   */
  formatCredential(credential: Credential): FormattedCredential {
    return formatCredentialUtil(credential);
  }

  /**
   * Find the first credential matching a schema SAID, or `undefined`.
   * Pure function — does not hit the network.
   */
  findCredentialBySchema(
    credentials: readonly Credential[],
    schemaSaid: string,
  ): Credential | undefined {
    return findCredentialBySchemaUtil(credentials, schemaSaid);
  }

  // ==================================================================
  // KERI signature verification
  // ==================================================================

  /**
   * Verify that an AID signed a message. Fetches the AID's current key
   * state from KERIA and validates the Ed25519 signature.
   *
   * This is the primitive for proving AID ownership during agent-to-agent
   * interactions.
   */
  async verifyAidSignature(params: VerifyAidSignatureParams): Promise<boolean> {
    return this.keri.verifySignature(params);
  }

  /**
   * Fetch current key state for an AID. Exposed for advanced use cases;
   * most consumers should just call {@link verifyAidSignature}.
   */
  async fetchKeyState(aid: string): Promise<AidKeyState> {
    return this.keri.fetchKeyState(aid);
  }
}
