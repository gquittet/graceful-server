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

    onRequest({
      serverStatus: status,
      livenessEndpoint: "/live",
      readinessEndpoint: "/ready",
    })(req, res);

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

    onRequest({
      serverStatus: status,
      livenessEndpoint: "/live",
      readinessEndpoint: "/ready",
    })(req, res);

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

    onRequest({
      serverStatus: status,
      livenessEndpoint: "/live",
      readinessEndpoint: "/ready",
    })(req, res);

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

    onRequest({
      serverStatus: status,
      livenessEndpoint: "/live",
      readinessEndpoint: "/ready",
    })(req, res);

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

    onRequest({
      serverStatus: status,
      livenessEndpoint: "/live",
      readinessEndpoint: "/ready",
    })(req, res);

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

    onRequest({
      serverStatus: status,
      livenessEndpoint: "/live",
      readinessEndpoint: "/ready",
    })(req, res);

    expect(res.end).not.toHaveBeenCalled();
  });

  describe("with livenessCheck callback", () => {
    it("should return 200 when livenessCheck returns { alive: true }", async () => {
      expect.assertions(3);
      const livenessCheck = vi.fn().mockResolvedValue({ alive: true });
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

      await onRequest({
        serverStatus: status,
        livenessEndpoint: "/live",
        readinessEndpoint: "/ready",
        livenessCheck,
      })(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
      const data = JSON.parse((res.end as ReturnType<typeof vi.fn>).mock.calls[0][0]);
      expect(data).toEqual({ uptime: expect.any(Number) });
    });

    it("should return 503 when livenessCheck returns { alive: false }", async () => {
      expect.assertions(2);
      const livenessCheck = vi.fn().mockResolvedValue({ alive: false });
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

      await onRequest({
        serverStatus: status,
        livenessEndpoint: "/live",
        readinessEndpoint: "/ready",
        livenessCheck,
      })(req, res);

      expect(res.statusCode).toBe(503);
      expect(res.end).toHaveBeenCalledWith();
    });

    it("should return 200 when livenessCheck returns undefined", async () => {
      expect.assertions(3);
      const livenessCheck = vi.fn().mockResolvedValue(undefined);
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

      await onRequest({
        serverStatus: status,
        livenessEndpoint: "/live",
        readinessEndpoint: "/ready",
        livenessCheck,
      })(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
      const data = JSON.parse((res.end as ReturnType<typeof vi.fn>).mock.calls[0][0]);
      expect(data).toEqual({ uptime: expect.any(Number) });
    });

    it("should return 503 and log when livenessCheck throws", async () => {
      expect.assertions(3);
      const error = new Error("db connection failed");
      const livenessCheck = vi.fn().mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
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

      await onRequest({
        serverStatus: status,
        livenessEndpoint: "/live",
        readinessEndpoint: "/ready",
        livenessCheck,
      })(req, res);

      expect(res.statusCode).toBe(503);
      expect(res.end).toHaveBeenCalledWith();
      expect(consoleSpy).toHaveBeenCalledWith("Liveness check failed:", error);
      consoleSpy.mockRestore();
    });
  });

  describe("with readinessCheck callback", () => {
    it("should return 200 when readinessCheck returns { ready: true } and server is ready", async () => {
      expect.assertions(3);
      const readinessCheck = vi.fn().mockResolvedValue({ ready: true });
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

      await onRequest({
        serverStatus: status,
        livenessEndpoint: "/live",
        readinessEndpoint: "/ready",
        readinessCheck,
      })(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ status: "ready" }));
    });

    it("should return 503 when readinessCheck returns { ready: false }", async () => {
      expect.assertions(2);
      const readinessCheck = vi.fn().mockResolvedValue({ ready: false });
      const status = {
        set: vi.fn(),
        get: vi.fn(),
        setReady: vi.fn(),
        isReady: vi.fn(),
        isShuttingDown: vi.fn(),
      } as IStatus;
      const req = { url: "/ready", method: "GET" } as http.IncomingMessage;
      const res = {
        headersSent: false,
        statusCode: 0,
        setHeader: vi.fn(),
        end: vi.fn(),
      } as unknown as http.ServerResponse;

      await onRequest({
        serverStatus: status,
        livenessEndpoint: "/live",
        readinessEndpoint: "/ready",
        readinessCheck,
      })(req, res);

      expect(res.statusCode).toBe(503);
      expect(res.end).toHaveBeenCalledWith();
    });

    it("should return 503 when server is not ready despite readinessCheck returning { ready: true }", async () => {
      expect.assertions(2);
      const readinessCheck = vi.fn().mockResolvedValue({ ready: true });
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

      await onRequest({
        serverStatus: status,
        livenessEndpoint: "/live",
        readinessEndpoint: "/ready",
        readinessCheck,
      })(req, res);

      expect(res.statusCode).toBe(503);
      expect(res.end).toHaveBeenCalledWith();
    });

    it("should return 503 and log when readinessCheck throws", async () => {
      expect.assertions(3);
      const error = new Error("timeout");
      const readinessCheck = vi.fn().mockRejectedValue(error);
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const status = {
        set: vi.fn(),
        get: vi.fn(),
        setReady: vi.fn(),
        isReady: vi.fn(),
        isShuttingDown: vi.fn(),
      } as IStatus;
      const req = { url: "/ready", method: "GET" } as http.IncomingMessage;
      const res = {
        headersSent: false,
        statusCode: 0,
        setHeader: vi.fn(),
        end: vi.fn(),
      } as unknown as http.ServerResponse;

      await onRequest({
        serverStatus: status,
        livenessEndpoint: "/live",
        readinessEndpoint: "/ready",
        readinessCheck,
      })(req, res);

      expect(res.statusCode).toBe(503);
      expect(res.end).toHaveBeenCalledWith();
      expect(consoleSpy).toHaveBeenCalledWith("Readiness check failed:", error);
      consoleSpy.mockRestore();
    });
  });
});
