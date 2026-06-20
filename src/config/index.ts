import type { IGracefulServerOptions } from "#interface/gracefulServerOptions";
import type { IOptions } from "#interface/options";

const DEFAULT_OPTIONS: IOptions = {
  syncClose: false,
  closePromises: [],
  timeout: 1000,
  healthCheck: true,
  kubernetes: false,
  livenessEndpoint: "/live",
  readinessEndpoint: "/ready",
  livenessCheck: undefined,
  readinessCheck: undefined,
};

export const makeOptions = (newOptions?: IGracefulServerOptions): IOptions => {
  const merged = { ...DEFAULT_OPTIONS, ...newOptions };
  return Object.freeze(merged);
};

export default DEFAULT_OPTIONS;
