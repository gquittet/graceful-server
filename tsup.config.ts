import { defineConfig } from "tsup";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  entry: ["./src/**/*.ts", "!./src/**/*.test.ts"],
  format: ["esm", "cjs"],
  outDir: "./lib",
  outExtension: ctx => {
    return { js: ctx.format === 'esm' ? ".mjs" : ".cjs" };
  },
  target: "node18",
  tsconfig: "tsconfig.prod.json",
  bundle: false,
  minify: true,
  clean: true,
  dts: { resolve: true, entry: "src/index.ts" },
  cjsInterop: true,
  splitting: true,
});
