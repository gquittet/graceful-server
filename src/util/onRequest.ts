import config from '@/config'
import IStatus from '@/interface/status'
import * as http from 'http'

const onRequest = (serverStatus: IStatus) => (req: http.IncomingMessage, res: http.ServerResponse) => {
  const { livenessEndpoint, readinessEndpoint } = config

  if (res.headersSent) return

  if (req.url === livenessEndpoint && req.method === 'GET') {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ uptime: process.uptime() | 0 }))
  }

  if (req.url === readinessEndpoint && req.method === 'GET') {
    if (serverStatus.isReady()) {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ status: 'ready' }))
    }
    res.statusCode = 503
    return res.end()
  }
}

export default onRequest
