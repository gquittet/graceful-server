import type { IGracefulServerOptions } from "../interface/gracefulServerOptions.js";
import http from "node:http";
import GracefulServer from "../index.js";

export type TestServer = {
  server: http.Server;
  port: number;
  url: string;
  gracefulServer: ReturnType<typeof GracefulServer>;
};

type Handler = (req: http.IncomingMessage, res: http.ServerResponse) => void;

const defaultHandler: Handler = (_req, res) => {
  if (res.headersSent) return;
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("OK");
};

export const createTestServer = (
  options?: IGracefulServerOptions,
  handler?: Handler,
): Promise<TestServer> =>
  new Promise((resolve, reject) => {
    const server = http.createServer(handler ?? defaultHandler);

    server.on("error", reject);

    server.listen(0, () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Failed to get server address"));
        return;
      }

      const port = address.port;
      const gracefulServer = GracefulServer(server, options);

      resolve({
        server,
        port,
        url: `http://localhost:${port}`,
        gracefulServer,
      });
    });
  });

export const cleanup = async ({ server }: TestServer): Promise<void> => {
  if (server.listening) {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
};
