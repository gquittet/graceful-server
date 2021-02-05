import { EventEmitter } from 'events'
import ICore from '~/interface/core'
import init from '~/util/init'
import shutdown from '~/util/shutdown'
import HttpServer from '../interface/httpServer'
import ImprovedServer from './improvedServer'
import Status from './status'

const core = (server: HttpServer): ICore => {
  const _emitter = new EventEmitter()
  const status = Status(_emitter)
  const _server = ImprovedServer(server, status)
  return {
    status,
    init: function () {
      return init(this)
    },
    shutdown: function (type: string, value: number, error?: Error) {
      return shutdown(_server, this)(type, value, error)
    },
    on: (name: string, callback: (...args: any[]) => void) => _emitter.on(name, callback)
  }
}

export default core
