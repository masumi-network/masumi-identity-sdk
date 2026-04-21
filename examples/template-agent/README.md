# Masumi Identity SDK — Template Agent

Minimal **Node** demo for [`@masumi_network/identity-sdk`](https://www.npmjs.com/package/@masumi_network/identity-sdk): one live call to Masumi infrastructure plus a local credential validation example.

## Prerequisites

- **Node** 18+ (repo standard is 20+)
- **pnpm** at the monorepo root

## Run

From the **monorepo root**:

```bash
pnpm install
pnpm --filter @masumi_network/identity-sdk build
pnpm --filter @masumi_network/identity-sdk-template-agent start
```

Watch mode:

```bash
pnpm --filter @masumi_network/identity-sdk-template-agent dev
```

## Configuration (optional)

By default the template uses **`MASUMI_IDENTITY_ENDPOINTS.production`**. Override for staging or self-hosted stacks:

```bash
VERIDIAN_CREDENTIAL_SERVER_URL=https://your-credential-server \
VERIDIAN_KERIA_URL=https://your-keria \
pnpm --filter @masumi_network/identity-sdk-template-agent start
```

## What this script does

1. **Live check** — Calls `MasumiIdentity#getIssuerOobi()` against the credential server so you can confirm connectivity and see the issuer OOBI string (what you’d share with a wallet to start linking).
2. **Offline validation** — Runs `validateCredential()` on a **mock** ACDC-shaped object (no network). In a real agent you’d pass credentials received over IPEX / A2A.

It does **not** run a full OOBI handshake, issuance, or signature verification loop; those need a wallet and real credentials. The script prints suggested `MasumiIdentity` calls for a full integration.

## Full documentation

- **Quickstart & API:** [Identity SDK docs](https://masumi-identity-sdk-docs-8lhm9.ondigitalocean.app)

## License

MIT
