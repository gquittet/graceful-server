import type { Server } from "#interface/server";
import type { IStatus } from "#interface/status";
import type * as http from "http";
import config from "#config/index";
import SocketsPool from "#core/socketsPool";
import onRequest from "#util/onRequest";

const { livenessEndpoint, readinessEndpoint } = config;

const improvedServer = <TServer extends Server>(
  server: TServer,
  serverStatus: IStatus,
): TServer & { stop: () => Promise<void> } => {
  const { healthCheck, kubernetes } = config;
  const socketsPool = SocketsPool();
  const secureSocketsPool = SocketsPool();
  let stopping = false;

  server.on("connection", socketsPool.onConnection);
  server.on("secureConnection", secureSocketsPool.onConnection);

  // Save user listeners
  const listeners = server.listeners("request");
  // Remove them from server
  server.removeAllListeners("request");

  // Setup the health check endpoints if health checks are enabled
  if (healthCheck) {
    // Add health checks endpoints
    server.on("request", onRequest(serverStatus));

    // Add the user listeners
    listeners.forEach((listener) =>
      server.on("request", (req: http.IncomingMessage, res: http.ServerResponse) => {
        // If the server is ready, call the listener. Else destroy the socket
        // Kubernetes handles the traffic so when the server is shutting down we have
        // to keep socket and active traffic.
        const hasToDestroySocket = kubernetes
          ? !serverStatus.isReady() && !serverStatus.isShuttingDown()
          : !serverStatus.isReady();

        if (hasToDestroySocket) return req.socket.destroy();

        // Check if the call is not for liveness or readiness.
        // If the call is not for liveness or readiness we can handle it.
        if (
          (req.url !== livenessEndpoint && req.url !== readinessEndpoint) ||
          req.method !== "GET"
        ) {
          return listener(req, res);
        }
      }),
    );
  } else {
    // Add the user listeners only
    listeners.forEach((listener) =>
      server.on("request", (req: http.IncomingMessage, res: http.ServerResponse) => {
        // If the server is ready, call the listener. Else destroy the socket
        if (serverStatus.isReady()) {
          return listener(req, res);
        } else {
          req.socket.destroy();
        }
      }),
    );
  }

  const stop = async (): Promise<void> => {
    if (!server.listening || stopping) {
      return;
    }

    stopping = true;

    server.removeAllListeners("request");
    server.on("request", (_: http.IncomingMessage, res: http.ServerResponse) => {
      if (!res.headersSent) res.setHeader("connection", "close");
    });

    await Promise.all([socketsPool.closeAll(), secureSocketsPool.closeAll()]);

    return new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  };

  return Object.assign(server, { stop });
};

export default improvedServer;
