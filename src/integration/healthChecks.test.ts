import { afterEach,describe, expect, it } from "vitest";
import { cleanup, createTestServer, type TestServer } from "./helpers.js";

describe("health checks", () => {
  let testServer: TestServer;

  afterEach(async () => {
    if (testServer) {
      await cleanup(testServer);
    }
  });

  it("GET /live should return 200 with uptime", async () => {
    testServer = await createTestServer();
    const res = await fetch(`${testServer.url}/live`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/json");
    const body = await res.json();
    expect(body).toHaveProperty("uptime");
    expect(typeof body.uptime).toBe("number");
  });

  it("GET /ready should return 503 when not ready", async () => {
    testServer = await createTestServer();
    const res = await fetch(`${testServer.url}/ready`);
    expect(res.status).toBe(503);
  });

  it("GET /ready should return 200 with status ready when server is ready", async () => {
    testServer = await createTestServer();
    testServer.gracefulServer.setReady();
    const res = await fetch(`${testServer.url}/ready`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/json");
    const body = await res.json();
    expect(body).toEqual({ status: "ready" });
  });

  it("GET /live with POST method should be ignored (pass to user handler)", async () => {
    testServer = await createTestServer();
    testServer.gracefulServer.setReady();
    const res = await fetch(`${testServer.url}/live`, { method: "POST", body: "test" });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");
  });

  it("GET /unknown should be ignored (pass to user handler)", async () => {
    testServer = await createTestServer();
    testServer.gracefulServer.setReady();
    const res = await fetch(`${testServer.url}/unknown`);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");
  });
});
