import type * as NodeProcess from "node:process";
import { describe, expect, it, vi } from "vitest";

vi.mock("node:process", async (importOriginal) => {
  const mod = await importOriginal<typeof NodeProcess>();
  return {
    ...mod,
    exit: vi.fn() as unknown as typeof NodeProcess.exit,
  };
});

describe("kubernetes mode", () => {
  it("should handle requests during shutdown grace period", async () => {
    vi.resetModules();
    const { createTestServer, cleanup } = await import("./helpers.js");
    const ts = await createTestServer(
      { kubernetes: true, timeout: 5000 },
      (_req, res) => {
        res.statusCode = 200;
        res.end("OK");
      },
    );
    ts.gracefulServer.setReady();

    const stopPromise = ts.gracefulServer.stop();
    const res = await fetch(`${ts.url}/test`);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");

    await stopPromise;
    await cleanup(ts);
  });
});
