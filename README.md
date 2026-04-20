# Masumi Identity SDK

Developer SDK and tooling for embedding decentralized identity (DIDs / KERI AIDs) and Verifiable Credential verification into AI agents on the [Masumi Network](https://masumi.network).

> **Status:** Pre-alpha scaffolding. Public API is not yet stable. See [Roadmap](#roadmap) below.

## What is this?

A thin, framework-agnostic TypeScript SDK that lets any developer:

- **Link an agent** to a KERI Autonomous Identifier (AID)
- **Request a Verifiable Credential** from an issuer
- **Verify a Verifiable Credential** received from another agent during an A2A interaction
- **Verify KERI signatures** against live key state

Under the hood it talks to the Masumi credential infrastructure (a KERI credential server + KERIA key state resolver) so you never need to touch ACDC, SAIDs, OOBIs, or Ed25519 cryptography directly.

## Monorepo layout

```
masumi-identity-sdk/
├── packages/
│   └── sdk/                 @masumi_network/identity-sdk (the published package)
├── examples/
│   └── template-agent/      Runnable reference implementation
├── docs/                    Documentation source (Phase 5)
└── .github/workflows/       CI + automated npm releases
```

## Quick start (local development)

```bash
pnpm install
pnpm build
pnpm test
```

Run the template agent against the live Masumi identity infrastructure:

```bash
pnpm --filter @masumi_network/identity-sdk-template-agent start
```

## Roadmap

This SDK corresponds to **Milestone 2: Developer SDK for Agent Identity** of the Masumi roadmap.

- [x] **Phase 0** — Repo + npm org setup
- [x] **Phase 1** — Scaffold monorepo (this commit)
- [ ] **Phase 2** — Extract core identity functions into clean public API
- [ ] **Phase 3** — Unit + integration test coverage
- [ ] **Phase 4** — Template agent demonstrating end-to-end flow
- [ ] **Phase 5** — Documentation portal (API reference + onboarding guides)
- [ ] **Phase 6** — Publish v0.1.0 to npm
- [ ] **Phase 7** — External integration case study

## Contributing

Issues and PRs welcome once v0.1.0 lands. This project uses [Changesets](https://github.com/changesets/changesets) for versioning — see [`.changeset/README.md`](./.changeset/README.md).

## License

[MIT](./LICENSE) — Masumi Network.
