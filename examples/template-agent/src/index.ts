/**
 * Masumi Identity SDK — Template Agent
 *
 * Minimal end-to-end demo showing how to use `@masumi-network/identity-sdk`.
 *
 * Run from the monorepo root:
 *   pnpm --filter @masumi-network/identity-sdk-template-agent start
 *
 * Override endpoints via env vars (optional):
 *   VERIDIAN_CREDENTIAL_SERVER_URL=https://your-server \
 *   VERIDIAN_KERIA_URL=https://your-keria \
 *   pnpm --filter @masumi-network/identity-sdk-template-agent start
 */

import {
  MASUMI_IDENTITY_ENDPOINTS,
  MasumiIdentity,
  validateCredential,
  VERSION,
} from "@masumi_network/identity-sdk";

const credentialServerUrl =
  process.env.VERIDIAN_CREDENTIAL_SERVER_URL ??
  MASUMI_IDENTITY_ENDPOINTS.production.credentialServerUrl;
const keriaUrl =
  process.env.VERIDIAN_KERIA_URL ??
  MASUMI_IDENTITY_ENDPOINTS.production.keriaUrl;

async function main(): Promise<void> {
  console.log(`Masumi Identity SDK v${VERSION} — template agent`);
  console.log(`Credential server: ${credentialServerUrl}`);
  console.log(`KERIA:             ${keriaUrl}`);
  console.log();

  const identity = new MasumiIdentity({ credentialServerUrl, keriaUrl });

  // 1. Liveness check: fetch the issuer OOBI from the credential server.
  //    This is the URL you share with a wallet to establish the first
  //    half of an agent-identity link.
  console.log("1. Fetching issuer OOBI from credential server...");
  try {
    const issuerOobi = await identity.getIssuerOobi();
    console.log(`   OK  → ${issuerOobi}`);
  } catch (error) {
    console.error(`   FAIL → ${(error as Error).message}`);
    console.error(
      "   Credential server unreachable. Check VERIDIAN_CREDENTIAL_SERVER_URL.",
    );
    process.exitCode = 1;
    return;
  }

  // 2. Demonstrate pure validation against a mock credential.
  //    In real usage you would receive this credential from another agent
  //    during an A2A interaction, via IPEX / the wallet.
  console.log();
  console.log("2. Validating a mock credential (pure, no network call)...");
  const mockCredential = {
    sad: {
      d: "EHrP-mock-credential-said",
      s: "EExample-schema-said",
      i: "EIssuer-aid",
      a: {
        i: "EHolder-aid",
        dt: new Date().toISOString(),
        agentId: "demo-agent-001",
      },
      ri: "ERegistry-said",
    },
    schema: {
      $id: "EExample-schema-said",
      credentialType: "AgentVerification",
      title: "Agent Verification",
    },
    status: { s: "0" as const },
  };
  const validation = validateCredential(mockCredential);
  console.log(`   Status : ${validation.status}`);
  console.log(`   Valid  : ${validation.isValid}`);
  console.log(`   Message: ${validation.message}`);

  console.log();
  console.log("Done. SDK is talking to live Masumi infrastructure.");
  console.log();
  console.log("Next steps for a real integration:");
  console.log("  a) Call identity.connectToAid(walletOobi) to link a wallet");
  console.log("  b) Call identity.issueCredential({ schemaSaid, aid }) to issue a VC");
  console.log("  c) Call identity.verifyAidSignature({ aid, message, signature })");
  console.log("     to prove another agent owns the AID it claims, during A2A.");
}

main().catch((error: unknown) => {
  console.error("Template agent failed:", error);
  process.exit(1);
});
