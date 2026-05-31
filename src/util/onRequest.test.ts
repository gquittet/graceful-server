import type { IStatus } from "#interface/status";
import type http from "node:http";
import { describe, expect, it, vi } from "vitest";
import onRequest from "#util/onRequest";

describe("onRequest", () => {
  it("should respond to liveness endpoint with 200", () => {
    expect.assertions(3);
    const status = {
      set: vi.fn(),
      get: vi.fn(),
      setReady: vi.fn(),
      isReady: vi.fn(),
      isShuttingDown: vi.fn(),
    } as IStatus;
    const req = { url: "/live", method: "GET" } as http.IncomingMessage;
    const res = {
      headersSent: false,
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as http.ServerResponse;

    onRequest(status)(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
    const data = JSON.parse((res.end as ReturnType<typeof vi.fn>).mock.calls[0][0]);
    expect(data).toEqual({ uptime: expect.any(Number) });
  });

  it("should respond to readiness endpoint with 200 when ready", () => {
    expect.assertions(3);
    const status = {
      set: vi.fn(),
      get: vi.fn(),
      setReady: vi.fn(),
      isReady: vi.fn().mockReturnValue(true),
      isShuttingDown: vi.fn(),
    } as IStatus;
    const req = { url: "/ready", method: "GET" } as http.IncomingMessage;
    const res = {
      headersSent: false,
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as http.ServerResponse;

    onRequest(status)(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ status: "ready" }));
  });

  it("should respond to readiness endpoint with 503 when not ready", () => {
    expect.assertions(2);
    const status = {
      set: vi.fn(),
      get: vi.fn(),
      setReady: vi.fn(),
      isReady: vi.fn().mockReturnValue(false),
      isShuttingDown: vi.fn(),
    } as IStatus;
    const req = { url: "/ready", method: "GET" } as http.IncomingMessage;
    const res = {
      headersSent: false,
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as http.ServerResponse;

    onRequest(status)(req, res);

    expect(res.statusCode).toBe(503);
    expect(res.end).toHaveBeenCalledWith();
  });

  it("should not respond if headers are already sent", () => {
    expect.assertions(1);
    const status = {
      set: vi.fn(),
      get: vi.fn(),
      setReady: vi.fn(),
      isReady: vi.fn(),
      isShuttingDown: vi.fn(),
    } as IStatus;
    const req = { url: "/live", method: "GET" } as http.IncomingMessage;
    const res = {
      headersSent: true,
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as http.ServerResponse;

    onRequest(status)(req, res);

    expect(res.end).not.toHaveBeenCalled();
  });

  it("should not respond to non-GET request on liveness endpoint", () => {
    expect.assertions(1);
    const status = {
      set: vi.fn(),
      get: vi.fn(),
      setReady: vi.fn(),
      isReady: vi.fn(),
      isShuttingDown: vi.fn(),
    } as IStatus;
    const req = { url: "/live", method: "POST" } as http.IncomingMessage;
    const res = {
      headersSent: false,
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as http.ServerResponse;

    onRequest(status)(req, res);

    expect(res.end).not.toHaveBeenCalled();
  });

  it("should not respond to unknown endpoints", () => {
    expect.assertions(1);
    const status = {
      set: vi.fn(),
      get: vi.fn(),
      setReady: vi.fn(),
      isReady: vi.fn(),
      isShuttingDown: vi.fn(),
    } as IStatus;
    const req = { url: "/unknown", method: "GET" } as http.IncomingMessage;
    const res = {
      headersSent: false,
      statusCode: 0,
      setHeader: vi.fn(),
      end: vi.fn(),
    } as unknown as http.ServerResponse;

    onRequest(status)(req, res);

    expect(res.end).not.toHaveBeenCalled();
  });
});
