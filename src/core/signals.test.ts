import { describe, expect, it } from "vitest";
import signals from "#core/signals";

describe("signals", () => {
  it("should have 4 entries", () => {
    expect(signals).toHaveLength(4);
  });

  it("should have SIGHUP with code 1", () => {
    expect(signals).toContainEqual({ type: "SIGHUP", code: 1 });
  });

  it("should have SIGBREAK with code 1", () => {
    expect(signals).toContainEqual({ type: "SIGBREAK", code: 1 });
  });

  it("should have SIGINT with code 2", () => {
    expect(signals).toContainEqual({ type: "SIGINT", code: 2 });
  });

  it("should have SIGTERM with code 15", () => {
    expect(signals).toContainEqual({ type: "SIGTERM", code: 15 });
  });
});
