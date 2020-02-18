export default interface IOptions {
  closePromises: (() => Promise<unknown>)[]
  timeout: number
  livenessEndpoint: string
  readinessEndpoint: string
}
