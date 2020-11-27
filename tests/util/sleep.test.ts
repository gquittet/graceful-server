import sleep from '~/util/sleep'

describe('sleep', () => {
  it('should wait the n millisecond', async () => {
    expect.assertions(2)
    const timeAtA = Date.now()
    await sleep(10)
    const timeAtB = Date.now()
    expect(timeAtB).toBeGreaterThan(timeAtA)
    expect(Math.round((timeAtB - timeAtA) / 10)).toBe(1)
  })
})
