import defaultConfig from '@/config'

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
})
