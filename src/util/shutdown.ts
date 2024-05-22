import type improvedServer from "#core/improvedServer";
import type { ICore } from "#interface/core";
import config from "#config/index";
import State from "#core/state";
import sleep from "#util/sleep";

const shutdown =
  <TServer extends ReturnType<typeof improvedServer>>(server: TServer, parent: ICore) =>
  async (type: string, value: number, body?: Error) => {
    const { timeout, closePromises } = config;

    const error: Error = body && body.message ? body : new Error(type);

    parent.status.set(State.SHUTTING_DOWN, error);

    await sleep(timeout);

    await Promise.all(closePromises.map((closePromise) => closePromise()));
    await server.stop();

    parent.status.set(State.SHUTDOWN, error);

    process.exit(128 + value);
  };

export default shutdown;
