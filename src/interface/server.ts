import type * as http from "node:http";

export type Server = Pick<
  http.Server,
  "on" | "listening" | "close" | "removeAllListeners" | "listeners"
>;
