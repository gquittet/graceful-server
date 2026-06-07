import { afterEach,describe, expect, it } from "vitest";
import { cleanup, createTestServer, type TestServer } from "./helpers.js";

describe("request handling", () => {
  let testServer: TestServer;

  afterEach(async () => {
    if (testServer) {
      await cleanup(testServer);
    }
  });

  it("should reject requests before setReady (socket destroyed)", async () => {
    testServer = await createTestServer(undefined, (_req, res) => {
      res.statusCode = 200;
      res.end("OK");
    });

    await expect(fetch(`${testServer.url}/test`)).rejects.toThrow();
  });

  it("should handle requests normally after setReady", async () => {
    testServer = await createTestServer(undefined, (_req, res) => {
      res.statusCode = 200;
      res.end("OK");
    });
    testServer.gracefulServer.setReady();

    const res = await fetch(`${testServer.url}/test`);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("OK");
  });

  it("should pass the request to the custom user handler", async () => {
    testServer = await createTestServer(undefined, (req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ url: req.url }));
    });
    testServer.gracefulServer.setReady();

    const res = await fetch(`${testServer.url}/custom-path`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ url: "/custom-path" });
  });

  it("should handle multiple concurrent requests after ready", async () => {
    testServer = await createTestServer(undefined, (_req, res) => {
      res.statusCode = 200;
      res.end("OK");
    });
    testServer.gracefulServer.setReady();

    const responses = await Promise.all([
      fetch(`${testServer.url}/a`),
      fetch(`${testServer.url}/b`),
      fetch(`${testServer.url}/c`),
    ]);

    for (const res of responses) {
      expect(res.status).toBe(200);
      expect(await res.text()).toBe("OK");
    }
  });
});
