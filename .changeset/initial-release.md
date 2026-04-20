---
"@masumi_network/identity-sdk": minor
---

Initial public release of the Masumi Identity SDK.

Features:
- `MasumiIdentity` client class with canonical production endpoints exposed via `MASUMI_IDENTITY_ENDPOINTS`
- Agent-to-AID linking: `getIssuerOobi`, `connectToAid`, `isAidConnected`
- Verifiable Credential operations: `issueCredential`, `getCredentialsForAid`, `revokeCredential`
- KERI signature verification: `fetchKeyState`, `verifyKeriSignature` (Ed25519)
- Credential utilities: `extractCredentialAttributes`, `validateCredential`, `formatCredential`, `findCredentialBySchema`
- Full TypeScript types, ESM + CJS builds, tree-shakeable
- 30 passing tests (unit + live integration against production infrastructure)
