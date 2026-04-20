/**
 * @masumi_network/identity-sdk
 *
 * TypeScript SDK for Masumi Identity. Link agents to KERI AIDs, issue and
 * verify Verifiable Credentials, and verify AID signatures in agent-to-agent
 * interactions — without touching ACDC, SAIDs, OOBIs, or Ed25519 directly.
 */

export { MasumiIdentity } from "./client.js";
export type { MasumiIdentityEnvironment } from "./constants.js";
export { MASUMI_IDENTITY_ENDPOINTS } from "./constants.js";
export type {
  AidKeyState,
  Credential,
  CredentialValidationOptions,
  CredentialValidationResult,
  FormattedCredential,
  IssueCredentialParams,
  MasumiIdentityConfig,
  VerifyAidSignatureParams,
} from "./types.js";
export {
  extractCredentialAttributes,
  findCredentialBySchema,
  formatCredential,
  validateCredential,
} from "./utils/credentials.js";

export const VERSION = "0.1.0";
