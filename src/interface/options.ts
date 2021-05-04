export default interface IOptions {
  closePromises: (() => Promise<unknown>)[]
  timeout: number
  healthCheck: boolean
  kubernetes: boolean
  livenessEndpoint: string
  readinessEndpoint: string
  gracePeriod: number
}
