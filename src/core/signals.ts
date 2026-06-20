const signals: { type: NodeJS.Signals; code: number }[] = [
  { type: "SIGHUP", code: 1 },
  { type: "SIGBREAK", code: 1 },
  { type: "SIGINT", code: 2 },
  { type: "SIGTERM", code: 15 },
];

export default signals;
