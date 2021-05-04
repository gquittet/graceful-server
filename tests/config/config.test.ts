import defaultConfig from '~/config'

describe('config', () => {
  it('should have a an empty array of promises to run on close', () => {
    expect.assertions(2)
    const { closePromises } = defaultConfig
    expect(Array.isArray(closePromises)).toBe(true)
    expect(closePromises).toHaveLength(0)
  })

  it('should have a default timeout of 1000ms', () => {
    expect.assertions(1)
    const { timeout } = defaultConfig
    expect(timeout).toBe(1000)
  })

  it('should have the health check enabled by default', () => {
    expect.assertions(1)
    const { healthCheck } = defaultConfig
    expect(healthCheck).toBe(true)
  })

  it('should have the kubernetes mode disabled by default', () => {
    expect.assertions(1)
    const { kubernetes } = defaultConfig
    expect(kubernetes).toBe(false)
  })

  it('should have a default liveness endpoint as /live', () => {
    expect.assertions(1)
    const { livenessEndpoint } = defaultConfig
    expect(livenessEndpoint).toBe('/live')
  })

  it('should have a default readiness endpoint as /ready', () => {
    expect.assertions(1)
    const { readinessEndpoint } = defaultConfig
    expect(readinessEndpoint).toBe('/ready')
  })
})
