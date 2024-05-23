import { defineConfig } from "tsup";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  entry: ["./src/**/*.ts"],
  format: ["esm", "cjs"],
  outDir: "./lib/src",
  target: "node18",
  tsconfig: "tsconfig.prod.json",
  bundle: false,
  minify: true,
  clean: true,
  cjsInterop: true,
  splitting: true,
});
