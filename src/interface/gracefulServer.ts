import { EventEmitter } from 'events'

export default interface IGracefulServer {
  isReady: () => boolean
  setReady: () => void
  on: (name: string, callback: (...args: any[]) => void) => EventEmitter
}
