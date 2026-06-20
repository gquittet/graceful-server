import type { HealthCheckResult } from "#interface/gracefulServerOptions";

export type IOptions = {
  syncClose: boolean;
  closePromises: (() => Promise<unknown>)[];
  timeout: number;
  healthCheck: boolean;
  kubernetes: boolean;
  livenessEndpoint: string;
  readinessEndpoint: string;
  livenessCheck?: () => Promise<HealthCheckResult>;
  readinessCheck?: () => Promise<HealthCheckResult>;
};
