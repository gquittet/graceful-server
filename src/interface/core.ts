import type { IStatus } from "#interface/status";
import type { EventEmitter } from "events";

export type ICore = {
  status: IStatus;
  init: () => ICore;
  shutdown: (type: string, value: number, error?: Error) => Promise<void>;
  on: (name: string, callback: (...args: unknown[]) => void) => EventEmitter;
};
