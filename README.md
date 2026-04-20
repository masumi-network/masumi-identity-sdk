# Masumi Identity SDK

Developer SDK for embedding decentralized identity (KERI AIDs) and Verifiable Credential verification into AI agents on the [Masumi Network](https://masumi.network).

[![npm](https://img.shields.io/npm/v/@masumi_network/identity-sdk.svg)](https://www.npmjs.com/package/@masumi_network/identity-sdk)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

## What is this?

A thin, framework-agnostic TypeScript SDK that lets any developer:

- **Link an agent** to a KERI Autonomous Identifier (AID)
- **Issue and hold Verifiable Credentials** as ACDCs
- **Verify a Verifiable Credential** received from another agent during an A2A interaction
- **Verify KERI signatures** against live key state

Under the hood it talks to the Masumi credential infrastructure (a KERI credential server + KERIA key state resolver) so you never need to touch ACDC, SAIDs, OOBIs, or Ed25519 cryptography directly.

## Links

- **Package:** [npm · @masumi_network/identity-sdk](https://www.npmjs.com/package/@masumi_network/identity-sdk)
- **Docs:** [masumi-network.github.io/masumi-identity-sdk](https://masumi-network.github.io/masumi-identity-sdk/) — API reference, tutorials, onboarding guide
- **Template agent:** [`examples/template-agent/`](./examples/template-agent)

## Install

```bash
pnpm add @masumi_network/identity-sdk
# or: npm install @masumi_network/identity-sdk
```

## Usage

```ts
import {
  MasumiIdentity,
  MASUMI_IDENTITY_ENDPOINTS,
} from "@masumi_network/identity-sdk";

const identity = new MasumiIdentity(MASUMI_IDENTITY_ENDPOINTS.production);

const issuerOobi = await identity.getIssuerOobi();
// Share with a wallet, receive the wallet's OOBI back...
await identity.connectToAid(walletOobi);

await identity.issueCredential({
  schemaSaid: "E...",
  aid: "E...",
  attributes: { agentId: "my-agent" },
});

// In A2A:
const ok = await identity.verifyAidSignature({ aid, message, signature });
```

See the [full documentation](https://masumi-network.github.io/masumi-identity-sdk/) for tutorials on agent linking, A2A verification, and every method on the client.

## Monorepo layout

```
masumi-identity-sdk/
├── packages/
│   └── sdk/                 @masumi_network/identity-sdk (the published package)
├── examples/
│   └── template-agent/      Runnable reference implementation
├── docs/                    Docusaurus documentation site (GitHub Pages)
└── .github/workflows/       CI + automated npm releases
```

## Local development

```bash
pnpm install
pnpm build
pnpm test

# Run the template agent against live Masumi infrastructure
pnpm --filter @masumi_network/identity-sdk-template-agent start

# Preview the docs site locally (requires Node 20+ inside docs/)
cd docs && npm install && npm start
```

## Roadmap

This SDK corresponds to **Milestone 2: Developer SDK for Agent Identity** of the Masumi roadmap.

- [x] **Phase 0** — Repo + npm org setup
- [x] **Phase 1** — Scaffold monorepo
- [x] **Phase 2** — Extract core identity functions into clean public API
- [x] **Phase 3** — Unit + integration test coverage (30 passing tests)
- [x] **Phase 4** — Template agent demonstrating end-to-end flow
- [x] **Phase 5** — Documentation portal (API reference + tutorials + onboarding guide)
- [x] **Phase 6** — Publish v0.1.0 to npm
- [ ] **Phase 7** — External integration case study

## Contributing

Issues and PRs welcome. This project uses [Changesets](https://github.com/changesets/changesets) for versioning — run `pnpm changeset` to propose a release alongside your PR.

## License

[MIT](./LICENSE) — Masumi Network.
