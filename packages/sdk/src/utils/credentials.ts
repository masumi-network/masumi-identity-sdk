import type {
  Credential,
  CredentialValidationOptions,
  CredentialValidationResult,
  FormattedCredential,
} from "../types.js";

const ACDC_METADATA_KEYS = new Set(["d", "i", "dt", "ri", "s"]);
const DEFAULT_EXPIRATION_DAYS = 365;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Extract user-supplied attributes from a credential's SAD, filtering out
 * ACDC metadata fields (`d`, `i`, `dt`, `ri`, `s`).
 */
export function extractCredentialAttributes(
  credential: Credential,
): Record<string, unknown> {
  const attributes = credential.sad?.a ?? {};
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attributes)) {
    if (!ACDC_METADATA_KEYS.has(key)) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Project a raw {@link Credential} into a structured shape convenient for
 * display and API responses.
 */
export function formatCredential(credential: Credential): FormattedCredential {
  const attributes = extractCredentialAttributes(credential);
  const schemaSaid = credential.sad?.s || credential.schema?.$id || "";
  const credentialType =
    credential.schema?.credentialType ||
    credential.schema?.title ||
    "Unknown Credential Type";
  const credentialTitle = credential.schema?.title || "";
  const issueeId = credential.sad?.a?.i || "";
  const issueeAid = credential.sad?.a?.i || "";
  const issuanceDateTime = credential.sad?.a?.dt || "";
  const credentialStatusRegistry = credential.sad?.ri || "";

  const statusValue = credential.status?.s;
  const eventType = credential.status?.et;
  const hasRevObject = Boolean(credential.rev);
  const isRevoked = statusValue === "1" || eventType === "rev" || hasRevObject;
  const isIssued = statusValue === "0" && eventType !== "rev" && !hasRevObject;

  let isExpired = false;
  if (issuanceDateTime) {
    const issuanceDate = new Date(issuanceDateTime);
    const oneYearAgo = new Date(Date.now() - 365 * MS_PER_DAY);
    isExpired = issuanceDate < oneYearAgo;
  }

  let status: "issued" | "revoked" | "expired";
  if (isRevoked) {
    status = "revoked";
  } else if (isExpired) {
    status = "expired";
  } else if (isIssued) {
    status = "issued";
  } else {
    status = "revoked";
  }

  return {
    schemaSaid,
    credentialType,
    credentialTitle,
    issueeId,
    issueeAid,
    issuanceDateTime,
    credentialStatusRegistry,
    attributes,
    status,
    isValid: isIssued && !isExpired && !isRevoked,
  };
}

/**
 * Validate a credential's issuance status, revocation, and expiration.
 */
export function validateCredential(
  credential: Credential,
  options?: CredentialValidationOptions,
): CredentialValidationResult {
  const expirationDays = options?.expirationDays ?? DEFAULT_EXPIRATION_DAYS;
  const schemaSaid = credential.sad?.s || credential.schema?.$id || "";
  const credentialType =
    credential.schema?.credentialType || credential.schema?.title || "Unknown";

  const statusValue = credential.status?.s;
  const eventType = credential.status?.et;
  const hasRevObject = Boolean(credential.rev);
  const isRevoked = statusValue === "1" || eventType === "rev" || hasRevObject;
  const isIssued = statusValue === "0" && eventType !== "rev" && !hasRevObject;

  const issuanceDateTime = credential.sad?.a?.dt;
  let isExpired = false;
  let expiresAt: string | undefined;

  if (issuanceDateTime) {
    const issuanceDate = new Date(issuanceDateTime);
    const expirationDate = new Date(
      issuanceDate.getTime() + expirationDays * MS_PER_DAY,
    );
    isExpired = new Date() > expirationDate;
    expiresAt = expirationDate.toISOString();
  }

  if (isRevoked) {
    return {
      isValid: false,
      status: "revoked",
      message: "Credential has been revoked",
      details: {
        revokedAt: credential.rev?.dt || credential.status?.dt || "Unknown",
        schemaSaid,
        credentialType,
      },
    };
  }

  if (isExpired) {
    return {
      isValid: false,
      status: "expired",
      message: "Credential has expired",
      details: { issuedAt: issuanceDateTime, expiresAt, schemaSaid, credentialType },
    };
  }

  if (isIssued) {
    return {
      isValid: true,
      status: "issued",
      message: "Credential is valid",
      details: { issuedAt: issuanceDateTime, expiresAt, schemaSaid, credentialType },
    };
  }

  return {
    isValid: false,
    status: "unknown",
    message: "Unknown credential status",
    details: { schemaSaid, credentialType },
  };
}

/**
 * Find the first credential matching a schema SAID, or `undefined`.
 */
export function findCredentialBySchema(
  credentials: readonly Credential[],
  schemaSaid: string,
): Credential | undefined {
  return credentials.find((cred) => {
    const credSchemaSaid = cred.sad?.s || cred.schema?.$id;
    return credSchemaSaid === schemaSaid;
  });
}
