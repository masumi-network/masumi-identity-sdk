# Masumi Identity SDK — Docs

This directory is the [Mintlify](https://mintlify.com) docs site for `@masumi_network/identity-sdk`.

## Local preview

```bash
# one-time
npm i -g mintlify

# run from the repo root
cd docs
mintlify dev
```

Opens at http://localhost:3000 with hot reload.

## Structure

```
docs/
├── docs.json                       # Mintlify config + navigation
├── introduction.mdx
├── quickstart.mdx
├── concepts.mdx
├── troubleshooting.mdx
├── tutorials/
│   ├── link-agent-to-aid.mdx
│   └── verify-vc-a2a.mdx
├── examples/
│   └── template-agent.mdx
├── api-reference/
│   ├── masumi-identity.mdx         # MasumiIdentity class
│   ├── agent-linking.mdx           # getIssuerOobi, connectToAid, isAidConnected
│   ├── credentials.mdx             # issueCredential, validateCredential, ...
│   ├── signature-verification.mdx  # verifyAidSignature, fetchKeyState
│   ├── utilities.mdx               # standalone pure helpers
│   ├── constants.mdx               # MASUMI_IDENTITY_ENDPOINTS, VERSION
│   └── types.mdx                   # all exported types
└── logo/
    ├── light.svg
    └── dark.svg
```

## Deployment

The site auto-deploys via the Mintlify GitHub app. Install it on the
`masumi-network/masumi-identity-sdk` repo, point it at this `docs/` folder,
and every push to `main` ships a new build to `https://<project>.mintlify.app`
(or a custom domain if one is configured).

## Editing

- Prefer **MDX** (`.mdx`) for everything — the Mintlify components
  (`<Card>`, `<Steps>`, `<CodeGroup>`, `<ParamField>`, …) require it.
- Any code snippet that references an API should be copy-paste runnable
  against `MASUMI_IDENTITY_ENDPOINTS.production` without modification.
- Keep method signatures in sync with `packages/sdk/src/` — there's no auto-gen
  yet, so it's a manual check.
