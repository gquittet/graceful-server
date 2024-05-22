import type { IGracefulServer } from "#interface/gracefulServer";
import type { IGracefulServerOptions } from "#interface/gracefulServerOptions";
import type { Server } from "#interface/server";
import { makeOptions } from "#config/index";
import GracefulServerCore from "#core/index";
import State from "#core/state";

const buildGracefulServer = (server: Server, options?: IGracefulServerOptions): IGracefulServer => {
  makeOptions(options);
  const gracefulServer = GracefulServerCore(server).init();
  return {
    isReady: () => gracefulServer.status.isReady(),
    setReady: () => gracefulServer.status.setReady(),
    on: gracefulServer.on,
  };
};

const GracefulServer = Object.assign(buildGracefulServer, State);

export * from "#interface/gracefulServer";

export default GracefulServer;
