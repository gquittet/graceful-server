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
      const opts = makeOptions({ timeout: 5000, healthCheck: false, kubernetes: true });

      expect(opts.timeout).toBe(5000);
      expect(opts.healthCheck).toBe(false);
      expect(opts.kubernetes).toBe(true);
      expect(opts.syncClose).toBe(false);
      expect(opts.livenessEndpoint).toBe("/live");
      expect(opts.readinessEndpoint).toBe("/ready");
    });

    it("should return a frozen object", () => {
      expect.assertions(1);
      const opts = makeOptions({ timeout: 2000 });

      expect(Object.isFrozen(opts)).toBe(true);
    });

    it("should return a new object each call", () => {
      expect.assertions(2);
      const opts1 = makeOptions({ timeout: 5000 });
      const opts2 = makeOptions({ timeout: 2000 });

      expect(opts1).not.toBe(opts2);
      expect(opts2.timeout).toBe(2000);
    });
  });
});
