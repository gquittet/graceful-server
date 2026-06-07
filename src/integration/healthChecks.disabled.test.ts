import { afterEach,describe, expect, it } from "vitest";
import { cleanup, createTestServer, type TestServer } from "./helpers.js";

describe("health checks disabled", () => {
  let testServer: TestServer;

  afterEach(async () => {
    if (testServer) {
      await cleanup(testServer);
    }
  });

  it("should not register health check endpoints when healthCheck is disabled", async () => {
    testServer = await createTestServer({ healthCheck: false });
    testServer.gracefulServer.setReady();

    const liveRes = await fetch(`${testServer.url}/live`);
    expect(liveRes.status).toBe(200);
    expect(await liveRes.text()).toBe("OK");

    const readyRes = await fetch(`${testServer.url}/ready`);
    expect(readyRes.status).toBe(200);
    expect(await readyRes.text()).toBe("OK");
  });
});
