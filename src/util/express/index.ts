import patch from '@/util/express/patch'
import validate from '@/util/express/validate'
import { Express } from 'express'

const express = () => {
  let _listener: Express | undefined
  let _needPatch = true
  return {
    validate: function(app: Express) {
      _listener = app
      return validate(_listener)
    },
    patch: () => {
      if (_listener && _needPatch) {
        patch.apply(_listener)
        _needPatch = false
      }
    }
  }
}

const expressPatcher = express()

export default expressPatcher
