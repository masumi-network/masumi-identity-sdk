import crypto from "node:crypto";

import type { AidKeyState } from "../types.js";

/**
 * Thin HTTP client for a KERIA agent. Fetches live key state and verifies
 * Ed25519 signatures produced by an AID.
 *
 * Not part of the public API — consumers should use
 * {@link ../client.MasumiIdentity}.
 */
export class KeriClient {
  constructor(
    private readonly keriaUrl: string,
    private readonly fetchImpl: typeof fetch = fetch,
  ) {
    if (!keriaUrl || typeof keriaUrl !== "string") {
      throw new TypeError("keriaUrl must be a non-empty string");
    }
  }

  /**
   * Fetch the current key state for an AID.
   *
   * KERI supports weighted multi-signature, so `k` in the underlying response
   * may be an array. For the v0.1 SDK we surface only the first signing key —
   * this is correct for single-sig AIDs which is the common case.
   */
  async fetchKeyState(aid: string): Promise<AidKeyState> {
    assertNonEmpty(aid, "aid");

    const response = await this.fetchImpl(
      `${this.keriaUrl}/identifiers/${encodeURIComponent(aid)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      throw new Error(
        `Failed to fetch key state: ${response.status} ${response.statusText}. ${errorText}`,
      );
    }

    const data = (await response.json()) as {
      k?: string | string[];
      [key: string]: unknown;
    };

    if (!data.k) {
      throw new Error("Key state does not contain public key");
    }

    const publicKey =
      Array.isArray(data.k) && data.k.length > 0
        ? data.k[0]
        : typeof data.k === "string"
          ? data.k
          : null;

    if (!publicKey || typeof publicKey !== "string") {
      throw new Error(
        "Invalid public key format: expected string or non-empty array of strings",
      );
    }

    const { k: _k, ...rest } = data;
    return { k: publicKey, ...rest };
  }

  /**
   * Verify an Ed25519 signature against the live key state of an AID.
   *
   * Fetches the current public key from KERIA, then validates the signature
   * using Node's native `crypto.verify`. KERI uses base64url encoding
   * (RFC 4648 §5) for keys and signatures.
   *
   * @returns `true` if the signature is valid, `false` if it does not match.
   *          Throws if the key cannot be fetched or is malformed.
   */
  async verifySignature(params: {
    aid: string;
    message: string;
    signature: string;
  }): Promise<boolean> {
    const keyState = await this.fetchKeyState(params.aid);

    const publicKeyBuffer = decodeBase64UrlFixed(keyState.k, 32, "public key");
    const signatureBuffer = decodeBase64UrlFixed(
      params.signature,
      64,
      "signature",
    );

    const messageBuffer = Buffer.from(params.message, "utf8");

    try {
      const keyObject = crypto.createPublicKey({
        key: publicKeyBuffer,
        format: "raw" as const,
        type: "ed25519" as const,
        // Node's types don't fully reflect the raw Ed25519 key format.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      return crypto.verify(null, messageBuffer, keyObject, signatureBuffer);
    } catch (error) {
      throw new Error(
        `Ed25519 signature verification failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Ensure Node.js 20+ is used.`,
      );
    }
  }
}

function assertNonEmpty(value: string, name: string): void {
  if (!value || typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`Invalid ${name}: must be a non-empty string`);
  }
}

function decodeBase64UrlFixed(
  value: string,
  expectedBytes: number,
  label: string,
): Buffer {
  let buffer: Buffer;
  try {
    buffer = Buffer.from(value, "base64url");
  } catch (error) {
    throw new Error(
      `Failed to decode ${label}: ${
        error instanceof Error ? error.message : "Invalid base64url encoding"
      }`,
    );
  }
  if (buffer.length !== expectedBytes) {
    throw new Error(
      `Invalid ${label} length: expected ${expectedBytes} bytes, got ${buffer.length}`,
    );
  }
  return buffer;
}
