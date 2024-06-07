import type { ICore } from "#interface/core";
import signals from "#core/signals";

/* global NodeJS */

const init = (parent: ICore) => {
  for (const signal of signals) {
    (process as NodeJS.EventEmitter).on(signal.type, async (body) => {
      await parent.stop({ type: signal.type, value: signal.code, body });
    });
  }
  return parent;
};

export default init;
