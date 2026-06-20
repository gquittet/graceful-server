export type HealthCheckResult = { alive?: boolean } | { ready?: boolean } | void;

export type IGracefulServerOptions = {
  syncClose?: boolean;
  closePromises?: (() => Promise<unknown>)[];
  timeout?: number;
  healthCheck?: boolean;
  kubernetes?: boolean;
  livenessEndpoint?: string;
  readinessEndpoint?: string;
  livenessCheck?: () => Promise<HealthCheckResult>;
  readinessCheck?: () => Promise<HealthCheckResult>;
};
