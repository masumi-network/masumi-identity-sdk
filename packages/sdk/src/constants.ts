/**
 * Canonical endpoints for the Masumi Identity infrastructure.
 *
 * These URLs are versioned alongside the SDK. If the network moves, a new
 * SDK release ships with updated URLs and consumers get the fix on upgrade.
 *
 * @example
 * ```ts
 * import {
 *   MasumiIdentity,
 *   MASUMI_IDENTITY_ENDPOINTS,
 * } from "@masumi_network/identity-sdk";
 *
 * const identity = new MasumiIdentity(MASUMI_IDENTITY_ENDPOINTS.production);
 * ```
 *
 * @example
 * ```ts
 * // Override via env / self-hosted:
 * const identity = new MasumiIdentity({
 *   credentialServerUrl:
 *     process.env.CRED_URL ??
 *     MASUMI_IDENTITY_ENDPOINTS.production.credentialServerUrl,
 *   keriaUrl:
 *     process.env.KERIA_URL ??
 *     MASUMI_IDENTITY_ENDPOINTS.production.keriaUrl,
 * });
 * ```
 */
export const MASUMI_IDENTITY_ENDPOINTS = {
  production: {
    credentialServerUrl: "https://cred-issuance.masumi-identity.xyz",
    keriaUrl: "https://keria.masumi-identity.xyz",
  },
} as const;

export type MasumiIdentityEnvironment = keyof typeof MASUMI_IDENTITY_ENDPOINTS;
