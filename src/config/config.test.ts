import { describe, expect, it } from "vitest";
import defaultConfig, { makeOptions } from "#config/index";

describe("config", () => {
  it("should have a an empty array of promises to run on close", () => {
    expect.assertions(2);
    const { closePromises } = defaultConfig;
    expect(Array.isArray(closePromises)).toBe(true);
    expect(closePromises).toHaveLength(0);
  });

  it("should have a default timeout of 1000ms", () => {
    expect.assertions(1);
    const { timeout } = defaultConfig;
    expect(timeout).toBe(1000);
  });

  it("should have the health check enabled by default", () => {
    expect.assertions(1);
    const { healthCheck } = defaultConfig;
    expect(healthCheck).toBe(true);
  });

  it("should have the kubernetes mode disabled by default", () => {
    expect.assertions(1);
    const { kubernetes } = defaultConfig;
    expect(kubernetes).toBe(false);
  });

  it("should have a default liveness endpoint as /live", () => {
    expect.assertions(1);
    const { livenessEndpoint } = defaultConfig;
    expect(livenessEndpoint).toBe("/live");
  });

  it("should have a default readiness endpoint as /ready", () => {
    expect.assertions(1);
    const { readinessEndpoint } = defaultConfig;
    expect(readinessEndpoint).toBe("/ready");
  });

  describe("makeOptions", () => {
    it("should override defaults with provided options", () => {
      expect.assertions(6);
      makeOptions({ timeout: 5000, healthCheck: false, kubernetes: true });

      expect(defaultConfig.timeout).toBe(5000);
      expect(defaultConfig.healthCheck).toBe(false);
      expect(defaultConfig.kubernetes).toBe(true);
      expect(defaultConfig.syncClose).toBe(false);
      expect(defaultConfig.livenessEndpoint).toBe("/live");
      expect(defaultConfig.readinessEndpoint).toBe("/ready");
    });

    it("should not allow overriding after first call", () => {
      expect.assertions(1);
      makeOptions({ timeout: 2000 });

      expect(defaultConfig.timeout).toBe(5000);
    });

    it("should return the options object", () => {
      expect.assertions(1);
      const result = makeOptions({ syncClose: true });

      expect(result).toBe(defaultConfig);
    });
  });
});
