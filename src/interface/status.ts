import State from '@/core/state'

export default interface IStatus {
  set: (status: State, error?: Error) => IStatus
  get: () => State
  setReady: () => void
  isReady: () => boolean
}
