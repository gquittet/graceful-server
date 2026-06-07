import type * as NodeProcess from "node:process";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, createTestServer, type TestServer } from "./helpers.js";

vi.mock("node:process", async (importOriginal) => {
  const mod = await importOriginal<typeof NodeProcess>();
  return {
    ...mod,
    exit: vi.fn() as unknown as typeof NodeProcess.exit,
  };
});

describe("shutdown timeout", () => {
  let testServer: TestServer;

  afterEach(async () => {
    if (testServer) {
      await cleanup(testServer);
    }
  });

  it("should respect timeout before shutting down", async () => {
    const start = Date.now();
    testServer = await createTestServer({ timeout: 500 });
    testServer.gracefulServer.setReady();
    await testServer.gracefulServer.stop();
    const elapsed = Date.now() - start;
    expect(elapsed).toBeGreaterThanOrEqual(450);
  });
});
