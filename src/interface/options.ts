export default interface IOptions {
  closePromises: (() => Promise<unknown>)[]
  timeout: number
  healthCheck: boolean
  livenessEndpoint: string
  readinessEndpoint: string
}
