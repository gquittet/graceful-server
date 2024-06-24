export type IGracefulServerOptions = {
  syncClose?: boolean;
  closePromises?: (() => Promise<unknown>)[];
  timeout?: number;
  healthCheck?: boolean;
  kubernetes?: boolean;
  livenessEndpoint?: string;
  readinessEndpoint?: string;
};
