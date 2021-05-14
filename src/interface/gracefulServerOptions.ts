export default interface IGracefulServerOptions {
  closePromises?: (() => Promise<unknown>)[]
  timeout?: number
  healthCheck?: boolean
  kubernetes?: boolean
  livenessEndpoint?: string
  readinessEndpoint?: string
}
