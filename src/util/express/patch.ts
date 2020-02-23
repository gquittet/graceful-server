import config from '@/config'
import { Express } from 'express'

const { livenessEndpoint, readinessEndpoint } = config

const patch = {
  apply: (app: Express) => {
    app.disable('x-powered-by')
    app.get(livenessEndpoint, () => {})
    app.get(readinessEndpoint, () => {})
  }
}

export default patch
