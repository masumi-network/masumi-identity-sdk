# Changesets

We use [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs.

## Adding a changeset

When you make a change that should be released:

```bash
pnpm changeset
```

Follow the prompts to describe your change and pick a semver bump (patch / minor / major).

A markdown file will be generated in this folder — commit it alongside your change.

## Releasing

Releases are automated via GitHub Actions (see `.github/workflows/release.yml`). On merge to `main`:

1. Changesets opens (or updates) a "Version Packages" PR bumping versions and updating CHANGELOGs
2. Merging that PR triggers `pnpm release`, which builds and publishes to npm
