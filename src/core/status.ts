import { EventEmitter } from 'events'
import IStatus from '~/interface/status'
import State from './state'

const Status = (eventEmitter: EventEmitter): IStatus => {
  let _currentState: State = State.STARTING
  return {
    set: function (state: State, body?: Object | string): IStatus {
      _currentState = state
      eventEmitter.emit(state, body)
      return this
    },
    get: (): State => _currentState,
    setReady: function () {
      this.set(State.READY)
    },
    isReady: (): boolean => _currentState === State.READY,
    isShuttingDown: (): boolean => _currentState === State.SHUTTING_DOWN
  }
}

export default Status
