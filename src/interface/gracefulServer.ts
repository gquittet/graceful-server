import type { EventEmitter } from "events";

export type IGracefulServer = {
  isReady: () => boolean;
  setReady: () => void;
  on: (name: string, callback: (...args: any[]) => void) => EventEmitter;
};
