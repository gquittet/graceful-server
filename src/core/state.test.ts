import { describe, expect, it } from "vitest";
import State from "#core/state";

describe("state", () => {
  it("should have STARTING state", () => {
    expect(State.STARTING).toBe("STARTING");
  });

  it("should have READY state", () => {
    expect(State.READY).toBe("READY");
  });

  it("should have SHUTTING_DOWN state", () => {
    expect(State.SHUTTING_DOWN).toBe("SHUTTING_DOWN");
  });

  it("should have SHUTDOWN state", () => {
    expect(State.SHUTDOWN).toBe("SHUTDOWN");
  });
});
