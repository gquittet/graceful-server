import config from '@/config'
import { Express } from 'express'

const { livenessEndpoint, readinessEndpoint } = config

const patch = {
  apply: (app: Express) => {
    // Add empty endpoints for liveness and readiness in express.
    // With this technique, express will recognize the liveness and readiness endpoint.
    // But it will do nothing.
    app.get(livenessEndpoint, () => {})
    app.get(readinessEndpoint, () => {})
    // Push these endpoints at the beginning of the middleware stack to avoid
    // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client.
    app._router.stack.unshift(app._router.stack.pop())
    app._router.stack.unshift(app._router.stack.pop())
  }
}

export default patch
