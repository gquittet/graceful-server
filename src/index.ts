import { makeOptions } from '@/config'
import GracefulServerCore from '@/core'
import State from '@/core/state'
import IGracefulServer from '@/interface/gracefulServer'
import IOptions from '@/interface/options'
import http from 'http'

const GracefulServer = (server: http.Server, options: IOptions): IGracefulServer => {
  makeOptions(options)
  const gracefulServer = GracefulServerCore(server).init()
  return {
    isReady: () => gracefulServer.status.isReady(),
    setReady: () => gracefulServer.status.setReady(),
    on: gracefulServer.on
  }
}

Object.assign(GracefulServer, State)

export default GracefulServer
