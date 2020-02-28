import * as express from 'express'

const validate = (requestListener: express.Express) =>
  requestListener &&
  requestListener._router &&
  Array.isArray(requestListener._router.stack) &&
  requestListener.request &&
  requestListener.response &&
  requestListener === requestListener.request.app &&
  requestListener === requestListener.response.app &&
  typeof requestListener.init === 'function' &&
  typeof requestListener.listen === 'function' &&
  typeof requestListener.use === 'function'

export default validate
