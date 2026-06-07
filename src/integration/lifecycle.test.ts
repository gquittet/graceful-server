import type * as NodeProcess from "node:process";
import { afterEach, describe, expect, it, vi } from "vitest";
import State from "../core/state.js";
import { cleanup, createTestServer, type TestServer } from "./helpers.js";

vi.mock("node:process", async (importOriginal) => {
  const mod = await importOriginal<typeof NodeProcess>();
  return {
    ...mod,
    exit: vi.fn() as unknown as typeof NodeProcess.exit,
  };
});

describe("lifecycle", () => {
  let testServer: TestServer;

  afterEach(async () => {
    if (testServer) {
      await cleanup(testServer);
    }
  });

  it("should start in STARTING state (isReady returns false)", async () => {
    testServer = await createTestServer();
    expect(testServer.gracefulServer.isReady()).toBe(false);
  });

  it("should transition to READY state after setReady", async () => {
    testServer = await createTestServer();
    testServer.gracefulServer.setReady();
    expect(testServer.gracefulServer.isReady()).toBe(true);
  });

  it("should emit READY event on setReady", async () => {
    testServer = await createTestServer();
    const events: string[] = [];
    testServer.gracefulServer.on(State.READY, () => events.push("ready"));

    testServer.gracefulServer.setReady();

    expect(events).toEqual(["ready"]);
  });

  it("should emit SHUTTING_DOWN then SHUTDOWN on stop", async () => {
    testServer = await createTestServer();
    const events: string[] = [];
    testServer.gracefulServer.on(State.SHUTTING_DOWN, () => events.push("shutting_down"));
    testServer.gracefulServer.on(State.SHUTDOWN, () => events.push("shutdown"));

    testServer.gracefulServer.setReady();
    await testServer.gracefulServer.stop();

    expect(events).toEqual(["shutting_down", "shutdown"]);
  });

  it("should not be ready after stop", async () => {
    testServer = await createTestServer();
    testServer.gracefulServer.setReady();
    await testServer.gracefulServer.stop();
    expect(testServer.gracefulServer.isReady()).toBe(false);
  });
});
