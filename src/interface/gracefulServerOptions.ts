export default interface IGracefulServerOptions {
  closePromises?: (() => Promise<unknown>)[]
  timeout?: number
  healthCheck?: boolean
  livenessEndpoint?: string
  readinessEndpoint?: string
}
