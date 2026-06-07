import { defineConfig, defaultExclude } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/integration/**/*.test.ts"],
    exclude: defaultExclude,
    testTimeout: 10_000,
  },
});
