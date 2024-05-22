import { defineConfig } from "tsup";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  outDir: "lib",
  tsconfig: "tsconfig.prod.json",
  dts: true,
  minify: true,
  clean: true,
  cjsInterop: true,
});
