import IStatus from '@/interface/status'
import { EventEmitter } from 'events'
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
    isReady: (): Boolean => _currentState === State.READY
  }
}

export default Status
