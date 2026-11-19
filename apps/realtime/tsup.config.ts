import { defineConfig } from "tsup";

// Single-file bundle (deps included) so the Docker image needs no node_modules.
export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["cjs"],
  platform: "node",
  target: "node22",
  outExtension: () => ({ js: ".cjs" }),
  noExternal: [/.*/],
  // optional native addons of `ws`, loaded inside try/catch
  external: ["bufferutil", "utf-8-validate"],
  clean: true,
});
