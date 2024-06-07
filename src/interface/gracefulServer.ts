import type { EventEmitter } from "events";

export type IGracefulServer = {
  isReady: () => boolean;
  setReady: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (name: string, callback: (...args: any[]) => void) => EventEmitter;
  stop: () => Promise<void>;
};
