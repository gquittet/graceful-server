import * as http from 'http'
import config from '~/config'
import ImprovedServer from '~/interface/improvedServer'
import IStatus from '~/interface/status'
import onRequest from '~/util/onRequest'
import SocketsPool from './socketsPool'

const { livenessEndpoint, readinessEndpoint } = config

const improvedServer = (server: http.Server, serverStatus: IStatus): ImprovedServer => {
  const { healthCheck } = config
  const socketsPool = SocketsPool()
  const secureSocketsPool = SocketsPool()
  let stopping = false

  server.on('connection', socketsPool.onConnection)
  server.on('secureConnection', secureSocketsPool.onConnection)

  // Save user listeners
  const listeners = server.listeners('request')
  // Remove them from server
  server.removeAllListeners('request')

  // Setup the health check endpoints if health checks are enabled
  if (healthCheck) {
    // Add health checks endpoints
    server.on('request', onRequest(serverStatus))

    // Add the user listeners
    listeners.forEach((listener: any) =>
      server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
        // If the server is ready, call the listener. Else destroy the socket
        if (serverStatus.isReady()) {
          if ((req.url !== livenessEndpoint && req.url !== readinessEndpoint) || req.method !== 'GET') {
            return listener(req, res)
          }
        } else {
          req.socket.destroy()
        }
      })
    )
  } else {
    // Add the user listeners only
    listeners.forEach((listener: any) =>
      server.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
        // If the server is ready, call the listener. Else destroy the socket
        if (serverStatus.isReady()) {
          return listener(req, res)
        } else {
          req.socket.destroy()
        }
      })
    )
  }

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
