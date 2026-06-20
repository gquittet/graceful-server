import type { IGracefulServer } from "#interface/gracefulServer";
import type { IGracefulServerOptions } from "#interface/gracefulServerOptions";
import type { Server } from "#interface/server";
import { makeOptions } from "#config/index";
import GracefulServerCore from "#core/index";
import State from "#core/state";

const buildGracefulServer = (server: Server, options?: IGracefulServerOptions): IGracefulServer => {
  const opts = makeOptions(options);
  const gracefulServer = GracefulServerCore(server, opts).init();
  return {
    isReady: () => gracefulServer.status.isReady(),
    setReady: () => gracefulServer.status.setReady(),
    on: gracefulServer.on,
    stop: async () => await gracefulServer.stop(),
  };
};

const GracefulServer = Object.assign(buildGracefulServer, State);

export * from "#interface/gracefulServer";
export * from "#interface/gracefulServerOptions";
export * from "#interface/options";

export default GracefulServer;
