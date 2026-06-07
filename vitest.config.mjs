import { defineConfig, defaultExclude } from "vitest/config";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  test: {
    coverage: {
      reporter: ["json", "lcov", "text", "html", "cobertura"],
    },
    exclude: [...defaultExclude, "src/integration/**"],
  },
});
