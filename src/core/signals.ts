const signals: { type: NodeJS.Signals | "uncaughtException"; code: number }[] = [
  { type: "SIGHUP", code: 1 },
  { type: "SIGBREAK", code: 1 },
  { type: "SIGINT", code: 2 },
  { type: "SIGTERM", code: 15 },
  { type: "uncaughtException", code: 2 },
];

export default signals;
