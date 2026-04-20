# @masumi_network/identity-sdk

TypeScript SDK for Masumi Identity. Link agents to KERI AIDs, request and verify Verifiable Credentials in agent-to-agent interactions — without needing to understand the underlying KERI / ACDC cryptography.

> **Status:** v0.1.x pre-release. Public API may evolve. See the [project README](../../README.md) for the current roadmap.

## Install

```bash
pnpm add @masumi_network/identity-sdk
# or
npm install @masumi_network/identity-sdk
```

## Quick start

```ts
import {
  MasumiIdentity,
  MASUMI_IDENTITY_ENDPOINTS,
} from "@masumi_network/identity-sdk";

const identity = new MasumiIdentity(MASUMI_IDENTITY_ENDPOINTS.production);

// 1. Share the issuer OOBI with a wallet to start the link
const issuerOobi = await identity.getIssuerOobi();

// 2. Once the wallet returns its own OOBI, resolve it
await identity.connectToAid(walletOobi);

// 3. Issue a credential binding the agent to the AID
await identity.issueCredential({
  schemaSaid: "E...",
  aid: "E...",
  attributes: { agentId: "my-agent-001" },
});

// 4. In A2A interactions, verify an AID owns the signature it claims
const ok = await identity.verifyAidSignature({
  aid: "E...",
  message: "hello",
  signature: "...",
});
```

### Custom endpoints

Pass any override via the constructor:

```ts
const identity = new MasumiIdentity({
  credentialServerUrl: "https://my-staging-server",
  keriaUrl: "https://my-keria",
});
```

## API surface

### Agent <-> AID linking

- `getIssuerOobi()`
- `connectToAid(oobi)`
- `isAidConnected(aid)`

### Verifiable Credentials

- `issueCredential({ schemaSaid, aid, attributes? })`
- `getCredentialsForAid(aid)`
- `validateCredential(credential, options?)` — pure, no network
- `formatCredential(credential)` — pure, no network
- `findCredentialBySchema(credentials, schemaSaid)` — pure, no network

### KERI signature verification

- `verifyAidSignature({ aid, message, signature })`
- `fetchKeyState(aid)`

### Constants

- `MASUMI_IDENTITY_ENDPOINTS.production` — canonical Masumi endpoints

## License

MIT — see [LICENSE](./LICENSE).
