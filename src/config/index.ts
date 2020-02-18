import IOptions from '@/interface/options'

const options: IOptions = {
  closePromises: [],
  timeout: 1000,
  livenessEndpoint: '/live',
  readinessEndpoint: '/ready'
}
let canOverride = true

export const makeOptions = (newOptions?: IOptions) => {
  if (canOverride) {
    Object.freeze(Object.assign(options, newOptions))
    canOverride = false
  }
  return options
}

export default options
