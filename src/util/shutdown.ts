import config from '@/config'
import State from '@/core/state'
import ICore from '@/interface/core'
import ImprovedServer from '@/interface/improvedServer'
import sleep from './sleep'

const shutdown = (server: ImprovedServer, parent: ICore) => async (type: string, value: number, body?: Error) => {
  const { timeout, closePromises } = config

  const error: Error = body && body.message ? body : new Error(type)

  parent.status.set(State.SHUTTING_DOWN, error)
  await sleep(timeout)

  await Promise.all(closePromises.map(closePromise => closePromise()))
  await server.stop()

  parent.status.set(State.SHUTDOWN, error)

  process.exit(128 + value)
}

export default shutdown
