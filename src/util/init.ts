import type { ICore } from "#interface/core";
import signals from "#core/signals";

/* global NodeJS */

const init = (parent: ICore) => {
  for (const signal of signals) {
    (process as NodeJS.EventEmitter).on(signal.type, async (body) => {
      await parent.stop({ type: signal.type, value: signal.code, body });
    });
  }

  // uncaughtException is not a system signal, it must be handled separately
  // Fire-and-forget: stop() always calls exit(), terminating the process.
  // Async cleanup is best-effort since Node.js does not await it here.
  process.on("uncaughtException", (error: Error) => {
    parent.stop({ type: "uncaughtException", value: 2, body: error });
  });

  return parent;
};

export default init;
