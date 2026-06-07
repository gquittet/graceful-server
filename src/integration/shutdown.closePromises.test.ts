import type * as NodeProcess from "node:process";
import { describe, expect, it, vi } from "vitest";

vi.mock("node:process", async (importOriginal) => {
  const mod = await importOriginal<typeof NodeProcess>();
  return {
    ...mod,
    exit: vi.fn() as unknown as typeof NodeProcess.exit,
  };
});

describe("shutdown with close promises", () => {
  it("should execute closePromises during shutdown", async () => {
    vi.resetModules();
    const { createTestServer, cleanup } = await import("./helpers.js");
    const events: string[] = [];
    const ts = await createTestServer({
      closePromises: [async () => { events.push("closed"); }],
      timeout: 100,
    });
    ts.gracefulServer.on("SHUTTING_DOWN", () => events.push("shutting_down"));
    ts.gracefulServer.setReady();
    await ts.gracefulServer.stop();
    expect(events).toEqual(["shutting_down", "closed"]);
    await cleanup(ts);
  });

  it("should execute closePromises in series with syncClose", async () => {
    vi.resetModules();
    const { createTestServer, cleanup } = await import("./helpers.js");
    const order: number[] = [];
    const ts = await createTestServer({
      closePromises: [
        async () => { order.push(1); },
        async () => { order.push(2); },
        async () => { order.push(3); },
      ],
      syncClose: true,
      timeout: 100,
    });
    ts.gracefulServer.setReady();
    await ts.gracefulServer.stop();
    expect(order).toEqual([1, 2, 3]);
    await cleanup(ts);
  });

  it("should execute closePromises without syncClose", async () => {
    vi.resetModules();
    const { createTestServer, cleanup } = await import("./helpers.js");
    const order: string[] = [];
    const ts = await createTestServer({
      closePromises: [
        async () => { order.push("a"); },
        async () => { order.push("b"); },
      ],
      timeout: 100,
    });
    ts.gracefulServer.setReady();
    await ts.gracefulServer.stop();
    expect(order).toEqual(["a", "b"]);
    await cleanup(ts);
  });

  it("should not call closePromises multiple times (non-réentrance)", async () => {
    vi.resetModules();
    const { createTestServer, cleanup } = await import("./helpers.js");
    let callCount = 0;
    const ts = await createTestServer({
      closePromises: [async () => { callCount++; }],
      timeout: 100,
    });
    ts.gracefulServer.setReady();
    await Promise.all([
      ts.gracefulServer.stop(),
      ts.gracefulServer.stop(),
      ts.gracefulServer.stop(),
    ]);
    expect(callCount).toBe(1);
    await cleanup(ts);
  });
});
