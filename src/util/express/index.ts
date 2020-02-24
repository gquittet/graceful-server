import patch from '@/util/express/patch'
import validate from '@/util/express/validate'
import { Express } from 'express'

const express = () => {
  let _needPatch = true
  return {
    validate: (app: Express) => validate(app),
    patch: (app: Express) => {
      if (_needPatch) {
        patch.apply(app)
        _needPatch = false
      }
    }
  }
}

const expressPatcher = express()

export default expressPatcher
