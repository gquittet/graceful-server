import type * as NodeProcess from "node:process";
import { describe, expect, it, vi } from "vitest";

vi.mock("node:process", async (importOriginal) => {
  const mod = await importOriginal<typeof NodeProcess>();
  return {
    ...mod,
    exit: vi.fn() as unknown as typeof NodeProcess.exit,
  };
});

describe("non-kubernetes mode", () => {
  it("should reject requests during shutdown", async () => {
    vi.resetModules();
    const { createTestServer, cleanup } = await import("./helpers.js");
    const ts = await createTestServer(
      { kubernetes: false, timeout: 5000 },
      (_req, res) => {
        res.statusCode = 200;
        res.end("OK");
      },
    );
    ts.gracefulServer.setReady();

    const stopPromise = ts.gracefulServer.stop();
    await expect(fetch(`${ts.url}/test`)).rejects.toThrow();
    await stopPromise;
    await cleanup(ts);
  });
});
