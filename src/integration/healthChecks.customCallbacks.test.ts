import { afterEach, describe, expect, it } from "vitest";
import { cleanup, createTestServer, type TestServer } from "./helpers.js";

describe("custom health check callbacks", () => {
  let testServer: TestServer;

  afterEach(async () => {
    if (testServer) {
      await cleanup(testServer);
    }
  });

  it("should return 200 on /live when livenessCheck returns alive", async () => {
    testServer = await createTestServer({
      healthCheck: true,
      livenessCheck: async () => ({ alive: true }),
    });
    testServer.gracefulServer.setReady();

    const res = await fetch(`${testServer.url}/live`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("uptime");
  });

  it("should return 503 on /live when livenessCheck returns not alive", async () => {
    testServer = await createTestServer({
      healthCheck: true,
      livenessCheck: async () => ({ alive: false }),
    });
    testServer.gracefulServer.setReady();

    const res = await fetch(`${testServer.url}/live`);
    expect(res.status).toBe(503);
    const text = await res.text();
    expect(text).toBe("");
  });

  it("should return 503 on /live when livenessCheck throws", async () => {
    testServer = await createTestServer({
      healthCheck: true,
      livenessCheck: async () => {
        throw new Error("liveness error");
      },
    });
    testServer.gracefulServer.setReady();

    const res = await fetch(`${testServer.url}/live`);
    expect(res.status).toBe(503);
  });

  it("should return 200 on /ready when readinessCheck returns ready and server is ready", async () => {
    testServer = await createTestServer({
      healthCheck: true,
      readinessCheck: async () => ({ ready: true }),
    });
    testServer.gracefulServer.setReady();

    const res = await fetch(`${testServer.url}/ready`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: "ready" });
  });

  it("should return 503 on /ready when readinessCheck returns not ready", async () => {
    testServer = await createTestServer({
      healthCheck: true,
      readinessCheck: async () => ({ ready: false }),
    });
    testServer.gracefulServer.setReady();

    const res = await fetch(`${testServer.url}/ready`);
    expect(res.status).toBe(503);
  });

  it("should return 503 on /ready when readinessCheck throws", async () => {
    testServer = await createTestServer({
      healthCheck: true,
      readinessCheck: async () => {
        throw new Error("readiness error");
      },
    });
    testServer.gracefulServer.setReady();

    const res = await fetch(`${testServer.url}/ready`);
    expect(res.status).toBe(503);
  });
});
