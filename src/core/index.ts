import type { ICore } from "#interface/core";
import type { Server } from "#interface/server";
import { EventEmitter } from "events";
import ImprovedServer from "#core/improvedServer";
import Status from "#core/status";
import init from "#util/init";

const core = (server: Server): ICore => {
  const _emitter = new EventEmitter();
  const status = Status(_emitter);
  const _server = ImprovedServer(server, status);
  return {
    status,
    init: function () {
      return init(this);
    },
    stop: function (args?: { type?: string; value: number; body?: Error }) {
      return _server.stop(args);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on: (name: string, callback: (...args: any[]) => void) => _emitter.on(name, callback),
  };
};

export default core;
