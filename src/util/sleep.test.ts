import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import sleep from "#util/sleep";

describe("sleep", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("should resolve after given milliseconds", async () => {
    const promise = sleep(1000);
    vi.advanceTimersByTime(1000);
    await expect(promise).resolves.toBeUndefined();
  });
});
