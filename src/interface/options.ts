export type IOptions = {
  closePromises: (() => Promise<unknown>)[];
  timeout: number;
  healthCheck: boolean;
  kubernetes: boolean;
  livenessEndpoint: string;
  readinessEndpoint: string;
};
