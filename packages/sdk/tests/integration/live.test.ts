/**
 * Integration tests against the live Masumi identity infrastructure.
 *
 * Only runs when explicitly opted in via `RUN_INTEGRATION=1`. Otherwise skipped.
 *
 * Usage:
 *   RUN_INTEGRATION=1 pnpm test:integration
 *
 * Override endpoints via env vars if you want to point at a staging or
 * self-hosted deployment:
 *   VERIDIAN_CREDENTIAL_SERVER_URL=... VERIDIAN_KERIA_URL=... RUN_INTEGRATION=1 pnpm test:integration
 */

import { describe, expect, it } from "vitest";

import { MASUMI_IDENTITY_ENDPOINTS, MasumiIdentity } from "../../src/index.js";

const SHOULD_RUN = process.env.RUN_INTEGRATION === "1";

const credentialServerUrl =
  process.env.VERIDIAN_CREDENTIAL_SERVER_URL ??
  MASUMI_IDENTITY_ENDPOINTS.production.credentialServerUrl;
const keriaUrl =
  process.env.VERIDIAN_KERIA_URL ??
  MASUMI_IDENTITY_ENDPOINTS.production.keriaUrl;

describe.skipIf(!SHOULD_RUN)("integration (live Masumi infrastructure)", () => {
  const identity = new MasumiIdentity({ credentialServerUrl, keriaUrl });

  it("fetches a non-empty issuer OOBI", async () => {
    const oobi = await identity.getIssuerOobi();
    expect(typeof oobi).toBe("string");
    expect(oobi.length).toBeGreaterThan(0);
    expect(oobi).toMatch(/oobi/i);
  });

  it("returns false for a random, never-seen AID", async () => {
    const randomAid = `E${"X".repeat(43)}`;
    const known = await identity.isAidConnected(randomAid);
    expect(known).toBe(false);
  });
});
