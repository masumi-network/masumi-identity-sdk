/**
 * Configuration for the {@link MasumiIdentity} client.
 */
export interface MasumiIdentityConfig {
  /**
   * Base URL of the Masumi KERI credential server.
   * Production value: `https://cred-issuance.masumi-identity.xyz`
   */
  credentialServerUrl: string;

  /**
   * Base URL of the KERIA agent (connect port, typically 3901).
   * Production value: `https://keria.masumi-identity.xyz`
   *
   * Required for signature verification against live key state.
   */
  keriaUrl: string;

  /**
   * Optional custom `fetch` implementation (useful for testing or non-Node runtimes).
   * Defaults to the global `fetch`.
   */
  fetch?: typeof fetch;
}

/**
 * Raw ACDC credential as returned by the KERI credential server.
 *
 * `sad` = "Self-Addressing Data" — the core credential payload.
 * `status` = TEL (transaction event log) status.
 */
export interface Credential {
  sad: {
    /** Credential SAID (unique credential ID). */
    d?: string;
    /** Schema SAID. */
    s: string;
    /** Issuer AID. */
    i: string;
    a: {
      /** Issuee AID. */
      i: string;
      /** Issuance datetime (ISO 8601). */
      dt: string;
      [key: string]: unknown;
    };
    /** Credential status registry SAID. */
    ri: string;
  };
  schema?: {
    $id: string;
    credentialType?: string;
    title?: string;
    version?: string;
  };
  status: {
    /** Status code: `"0"` = issued, `"1"` = revoked. */
    s: "0" | "1";
    /** Event type. */
    et?: string;
    /** Datetime. */
    dt?: string;
  };
  rev?: {
    s: string;
    dt: string;
  };
}

/**
 * Structured, developer-friendly projection of a {@link Credential}.
 */
export interface FormattedCredential {
  schemaSaid: string;
  credentialType: string;
  credentialTitle: string;
  issueeId: string;
  issueeAid: string;
  issuanceDateTime: string;
  credentialStatusRegistry: string;
  attributes: Record<string, unknown>;
  status: "issued" | "revoked" | "expired";
  isValid: boolean;
}

/**
 * Result of validating a credential's status and expiration.
 */
export interface CredentialValidationResult {
  isValid: boolean;
  status: "issued" | "revoked" | "expired" | "unknown";
  message: string;
  details?: {
    issuedAt?: string;
    revokedAt?: string;
    expiresAt?: string;
    schemaSaid?: string;
    credentialType?: string;
  };
}

/**
 * Options for {@link validateCredential}.
 */
export interface CredentialValidationOptions {
  /**
   * Number of days after issuance that the credential should be considered expired.
   * Defaults to 365.
   */
  expirationDays?: number;
}

/**
 * Parameters for {@link MasumiIdentity.issueCredential}.
 */
export interface IssueCredentialParams {
  /** Schema SAID of the credential to issue. */
  schemaSaid: string;
  /** Recipient AID. */
  aid: string;
  /** Optional attributes to embed in the credential. */
  attributes?: Record<string, unknown>;
}

/**
 * Parameters for {@link MasumiIdentity.verifyAidSignature}.
 */
export interface VerifyAidSignatureParams {
  /** AID that allegedly signed the message. */
  aid: string;
  /** Plaintext message that was signed. */
  message: string;
  /** Base64url-encoded Ed25519 signature. */
  signature: string;
}

/**
 * Key state for an AID, as resolved from KERIA.
 *
 * `k` is the currently active public key (base64url-encoded Ed25519).
 * Multi-sig AIDs expose multiple keys; this SDK currently surfaces the first one.
 */
export interface AidKeyState {
  k: string;
  [key: string]: unknown;
}
