import { afterEach,describe, expect, it } from "vitest";
import { cleanup, createTestServer, type TestServer } from "./helpers.js";

describe("custom health check endpoints", () => {
  let testServer: TestServer;

  afterEach(async () => {
    if (testServer) {
      await cleanup(testServer);
    }
  });

  it("should use custom liveness and readiness endpoints", async () => {
    testServer = await createTestServer({ livenessEndpoint: "/healthz", readinessEndpoint: "/readyz" });
    testServer.gracefulServer.setReady();

    const liveRes = await fetch(`${testServer.url}/healthz`);
    expect(liveRes.status).toBe(200);
    const liveBody = await liveRes.json();
    expect(liveBody).toHaveProperty("uptime");

    const readyRes = await fetch(`${testServer.url}/readyz`);
    expect(readyRes.status).toBe(200);
    const readyBody = await readyRes.json();
    expect(readyBody).toEqual({ status: "ready" });

    await cleanup(testServer);
  });
});
