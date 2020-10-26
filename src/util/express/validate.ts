import * as express from 'express'

const validate = (requestListener: express.Express) =>
  validateExpress(requestListener) && (validateV4(requestListener) || validateV5(requestListener))

const validateExpress = (requestListener: express.Express) =>
  requestListener &&
  requestListener.request &&
  requestListener.response &&
  requestListener === requestListener.request.app &&
  requestListener === requestListener.response.app &&
  typeof requestListener.init === 'function' &&
  typeof requestListener.listen === 'function' &&
  typeof requestListener.use === 'function'

const validateV4 = (requestListener: express.Express) =>
  requestListener._router && Array.isArray(requestListener._router.stack)

const validateV5 = (requestListener: any) => requestListener.router && Array.isArray(requestListener.router.stack)

export default validate
