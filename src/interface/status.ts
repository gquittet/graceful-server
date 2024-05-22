import type State from "#core/state";

export type IStatus = {
  set: (status: State, error?: Error) => IStatus;
  get: () => State;
  setReady: () => void;
  isReady: () => boolean;
  isShuttingDown: () => boolean;
};
