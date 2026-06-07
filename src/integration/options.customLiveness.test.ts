import { afterEach,describe, expect, it } from "vitest";
import { cleanup, createTestServer, type TestServer } from "./helpers.js";

describe("custom liveness endpoint", () => {
  let testServer: TestServer;

  afterEach(async () => {
    if (testServer) {
      await cleanup(testServer);
    }
  });

  it("should use custom liveness endpoint", async () => {
    testServer = await createTestServer({ livenessEndpoint: "/healthz" });
    testServer.gracefulServer.setReady();

    const liveRes = await fetch(`${testServer.url}/healthz`);
    expect(liveRes.status).toBe(200);
    const liveBody = await liveRes.json();
    expect(liveBody).toHaveProperty("uptime");

    await cleanup(testServer);
  });
});
