import type { IStatus } from "#interface/status";
import type { EventEmitter } from "events";
import State from "#core/state";

const Status = (eventEmitter: EventEmitter): IStatus => {
  let _currentState: State = State.STARTING;
  return {
    set: function (state: State, body?: object | string): IStatus {
      _currentState = state;
      eventEmitter.emit(state, body);
      return this;
    },
    get: (): State => _currentState,
    setReady: function () {
      this.set(State.READY);
    },
    isReady: (): boolean => _currentState === State.READY,
    isShuttingDown: (): boolean => _currentState === State.SHUTTING_DOWN,
  };
};

export default Status;
