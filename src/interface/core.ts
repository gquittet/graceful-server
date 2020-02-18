import { EventEmitter } from 'events'
import IStatus from './status'

export default interface ICore {
  status: IStatus
  init: () => ICore
  shutdown: (type: string, value: number, error?: Error) => Promise<void>
  on: (name: string, callback: (...args: any[]) => void) => EventEmitter
}
