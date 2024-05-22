import type { IStatus } from "#interface/status";
import type * as http from "http";
import config from "#config/index";

const onRequest =
  (serverStatus: IStatus) =>
  (req: http.IncomingMessage, res: http.ServerResponse): void => {
    const { livenessEndpoint, readinessEndpoint } = config;

    if (res.headersSent) return;

    if (req.url === livenessEndpoint && req.method === "GET") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ uptime: process.uptime() | 0 }));
      return;
    }

    if (req.url === readinessEndpoint && req.method === "GET") {
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
