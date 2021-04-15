import config from '~/config'
import { MILLISECONDS_IN_ONE_SECOND } from '~/constants'
import State from '~/core/state'
import ICore from '~/interface/core'
import ImprovedServer from '~/interface/improvedServer'
import sleep from './sleep'

const shutdown = (server: ImprovedServer, parent: ICore) => async (type: string, value: number, body?: Error) => {
  const { timeout, closePromises, gracePeriod } = config

  const error: Error = body && body.message ? body : new Error(type)

  if (gracePeriod > 0) {
    await sleep(gracePeriod * MILLISECONDS_IN_ONE_SECOND)
  }

  parent.status.set(State.SHUTTING_DOWN, error)
  await sleep(timeout)

  await Promise.all(closePromises.map(closePromise => closePromise()))
  await server.stop()

  parent.status.set(State.SHUTDOWN, error)

  process.exit(128 + value)
}

export default shutdown
