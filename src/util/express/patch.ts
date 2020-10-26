import config from '@/config'

const { livenessEndpoint, readinessEndpoint } = config

const patch = {
  apply: (app: any) => {
    // Exclude endpoints for liveness and readiness in express.
    // With this technique, the endpoints liveness and readiness will be callable.
    // But express will do nothing.
    // Thus, we avoid this kind of error:
    // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client.
    const oldExpressHandler = app.handle
    app.handle = function (req: any, res: any, next: any) {
      if (req.url !== livenessEndpoint && req.url !== readinessEndpoint) {
        oldExpressHandler.call(app, req, res, next)
      }
    }
  }
}

export default patch
