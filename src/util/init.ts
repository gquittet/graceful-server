import signals from '~/core/signals'
import ICore from '~/interface/core'

/* global NodeJS */

const init = (parent: ICore) => {
  for (const signal of signals) {
    ;(process as NodeJS.EventEmitter).on(signal.type, async body => {
      await parent.shutdown(signal.type, signal.code, body)
    })
  }
  return parent
}

export default init
