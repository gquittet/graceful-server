import { defineConfig } from "vitest/config";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  test: {
    coverage: {
      reporter: ["json", "lcov", "text", "html", "cobertura"],
    },
  },
});
