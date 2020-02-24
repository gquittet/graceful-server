import config from '@/config'
import ImprovedServer from '@/interface/improvedServer'
import IStatus from '@/interface/status'
import express from '@/util/express'
import onRequest from '@/util/onRequest'
import * as http from 'http'
import SocketsPool from './socketsPool'

const improvedServer = (server: http.Server, serverStatus: IStatus): ImprovedServer => {
  const { healthCheck } = config
  const socketsPool = SocketsPool()
  const secureSocketsPool = SocketsPool()
  let stopping = false

  server.on('connection', socketsPool.onConnection)
  server.on('secureConnection', secureSocketsPool.onConnection)

  // Save user listeners
  const listeners = server.listeners('request')
  // Remove it from server
  server.removeAllListeners('request')

  // Setup my default listener
  if (healthCheck) {
    // Identify the framework to apply patches
    listeners.forEach((listener: any) => {
      if (express.validate(listener)) express.patch(listener)
    })

    server.on('request', onRequest(serverStatus))
  }

  // Add the user listeners
  listeners.forEach((listener: any) =>
    server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
      // If the server is ready call the listener, else destroy the socket
      if (serverStatus.isReady()) {
        listener(req, res)
      } else {
        req.socket.destroy()
      }
    })
  )

  const stop = async (): Promise<void> => {
    if (!server.listening || stopping) {
      return
    }

    stopping = true

    server.removeAllListeners('request')
    server.on('request', (_: http.IncomingMessage, res: http.ServerResponse) => {
      if (!res.headersSent) return res.setHeader('connection', 'close')
    })

    await Promise.all([socketsPool.closeAll(), secureSocketsPool.closeAll()])

    return new Promise((resolve, reject) => {
      server.close(error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  return Object.assign(server, { stop })
}

export default improvedServer
