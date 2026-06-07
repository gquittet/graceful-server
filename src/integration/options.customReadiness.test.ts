import { afterEach,describe, expect, it } from "vitest";
import { cleanup, createTestServer, type TestServer } from "./helpers.js";

describe("custom readiness endpoint", () => {
  let testServer: TestServer;

  afterEach(async () => {
    if (testServer) {
      await cleanup(testServer);
    }
  });

  it("should use custom readiness endpoint", async () => {
    testServer = await createTestServer({ readinessEndpoint: "/readyz" });
    testServer.gracefulServer.setReady();

    const readyRes = await fetch(`${testServer.url}/readyz`);
    expect(readyRes.status).toBe(200);
    const readyBody = await readyRes.json();
    expect(readyBody).toEqual({ status: "ready" });

    await cleanup(testServer);
  });
});
