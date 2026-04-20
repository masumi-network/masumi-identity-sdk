import { describe, expect, it } from "vitest";

import {
  MASUMI_IDENTITY_ENDPOINTS,
  MasumiIdentity,
  VERSION,
} from "../../src/index.js";

describe("smoke", () => {
  it("exports VERSION as a semver-ish string", () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("exports production endpoints as https URLs", () => {
    expect(MASUMI_IDENTITY_ENDPOINTS.production.credentialServerUrl).toMatch(
      /^https:\/\//,
    );
    expect(MASUMI_IDENTITY_ENDPOINTS.production.keriaUrl).toMatch(/^https:\/\//);
  });

  it("can construct directly from the endpoints constant", () => {
    const identity = new MasumiIdentity(MASUMI_IDENTITY_ENDPOINTS.production);
    expect(identity).toBeInstanceOf(MasumiIdentity);
  });

  it("constructs a MasumiIdentity with valid config", () => {
    const identity = new MasumiIdentity({
      credentialServerUrl: "https://cred.example.com",
      keriaUrl: "https://keria.example.com",
    });
    expect(identity).toBeInstanceOf(MasumiIdentity);
  });

  it("rejects empty credentialServerUrl", () => {
    expect(
      () =>
        new MasumiIdentity({
          credentialServerUrl: "",
          keriaUrl: "https://keria.example.com",
        }),
    ).toThrow(/credentialServerUrl/);
  });

  it("rejects empty keriaUrl", () => {
    expect(
      () =>
        new MasumiIdentity({
          credentialServerUrl: "https://cred.example.com",
          keriaUrl: "",
        }),
    ).toThrow(/keriaUrl/);
  });
});
