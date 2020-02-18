export default interface IGracefulServerOptions {
  closePromises?: (() => Promise<unknown>)[]
  timeout?: number
  livenessEndpoint?: string
  readinessEndpoint?: string
}
