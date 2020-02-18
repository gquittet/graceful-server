import defaultConfig from '@/config'

describe('config', () => {
  const defaultSignals = [
    { type: 'SIGHUP', code: 1 },
    { type: 'SIGINT', code: 2 },
    { type: 'SIGTERM', code: 15 }
  ]

  it('should have a graceTimeout of 100ms', () => {
    expect.assertions(1)
    const { graceTimeout } = defaultConfig
    expect(graceTimeout).toBe(100)
  })

  it('should have a an empty array of promises to run on close', () => {
    expect.assertions(2)
    const { closePromises } = defaultConfig
    expect(Array.isArray(closePromises)).toBe(true)
    expect(closePromises).toHaveLength(0)
  })

  it('should have the 3 default signals', () => {
    expect.assertions(1)
    const { signals } = defaultConfig
    expect(signals).toEqual(expect.arrayContaining(defaultSignals))
  })

  it('should have a default timeout of 1000ms', () => {
    expect.assertions(1)
    const { timeout } = defaultConfig
    expect(timeout).toBe(1000)
  })
})
