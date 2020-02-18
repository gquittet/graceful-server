import { makeOptions } from '@/config'
import GracefulServerCore from '@/core'
import State from '@/core/state'
import IGracefulServer from '@/interface/gracefulServer'
import IGracefulServerOptions from '@/interface/gracefulServerOptions'
import http from 'http'

const buildGracefulServer = (server: http.Server, options?: IGracefulServerOptions): IGracefulServer => {
  makeOptions(options)
  const gracefulServer = GracefulServerCore(server).init()
  return {
    isReady: () => gracefulServer.status.isReady(),
    setReady: () => gracefulServer.status.setReady(),
    on: gracefulServer.on
  }
}

const GracefulServer = Object.assign(buildGracefulServer, State)

export default GracefulServer
