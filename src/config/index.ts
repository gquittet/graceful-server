import type { IGracefulServerOptions } from "#interface/gracefulServerOptions";
import type { IOptions } from "#interface/options";

const options: IOptions = {
  closePromises: [],
  timeout: 1000,
  healthCheck: true,
  kubernetes: false,
  livenessEndpoint: "/live",
  readinessEndpoint: "/ready",
};
let canOverride = true;

export const makeOptions = (newOptions?: IGracefulServerOptions) => {
  if (canOverride) {
    Object.freeze(Object.assign(options, newOptions));
    canOverride = false;
  }
  return options;
};

export default options;
