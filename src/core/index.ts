import type { ICore } from "#interface/core";
import type { Server } from "#interface/server";
import { EventEmitter } from "events";
import ImprovedServer from "#core/improvedServer";
import Status from "#core/status";
import init from "#util/init";
import shutdown from "#util/shutdown";

const core = (server: Server): ICore => {
  const _emitter = new EventEmitter();
  const status = Status(_emitter);
  const _server = ImprovedServer(server, status);
  return {
    status,
    init: function () {
      return init(this);
    },
    shutdown: function (type: string, value: number, error?: Error) {
      return shutdown(_server, this)(type, value, error);
    },
    on: (name: string, callback: (...args: unknown[]) => void) => _emitter.on(name, callback),
  };
};

export default core;
