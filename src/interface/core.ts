import type { IStatus } from "#interface/status";
import type { EventEmitter } from "events";

export type ICore = {
  status: IStatus;
  init: () => ICore;
  stop: (args?: { type?: string; value: number; body?: Error }) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on: (name: string, callback: (...args: any[]) => void) => EventEmitter;
};
