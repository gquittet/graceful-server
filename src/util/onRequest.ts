import type { HealthCheckResult } from "#interface/gracefulServerOptions";
import type { IStatus } from "#interface/status";
import type http from "node:http";

type HealthCheckCallback = (() => Promise<HealthCheckResult>) | undefined;

export type OnRequestOptions = {
  serverStatus: IStatus;
  livenessEndpoint: string;
  readinessEndpoint: string;
  livenessCheck?: HealthCheckCallback;
  readinessCheck?: HealthCheckCallback;
};

const onRequest =
  (options: OnRequestOptions) =>
  async (req: http.IncomingMessage, res: http.ServerResponse): Promise<void> => {
    const { serverStatus, livenessEndpoint, readinessEndpoint, livenessCheck, readinessCheck } =
      options;

    if (res.headersSent) return;

    if (req.url === livenessEndpoint && req.method === "GET") {
      if (livenessCheck) {
        try {
          const result = await livenessCheck();
          if (result && "alive" in result && result.alive === false) {
            res.statusCode = 503;
            res.end();
            return;
          }
        } catch (err) {
          console.error("Liveness check failed:", err);
          res.statusCode = 503;
          res.end();
          return;
        }
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ uptime: process.uptime() | 0 }));
      return;
    }

    if (req.url === readinessEndpoint && req.method === "GET") {
      if (readinessCheck) {
        try {
          const result = await readinessCheck();
          if (result && "ready" in result && result.ready === false) {
            res.statusCode = 503;
            res.end();
            return;
          }
        } catch (err) {
          console.error("Readiness check failed:", err);
          res.statusCode = 503;
          res.end();
          return;
        }
      }
      if (serverStatus.isReady()) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ status: "ready" }));
        return;
      }
      res.statusCode = 503;
      res.end();
    }
  };

export default onRequest;
