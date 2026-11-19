import { defineConfig } from "tsup";

// Bundle the migration runner into a single self-contained file so the
// `migrate` Docker image only needs node + the SQL files in ./drizzle.
export default defineConfig({
  entry: { migrate: "src/migrate.ts" },
  format: ["cjs"],
  platform: "node",
  target: "node22",
  outExtension: () => ({ js: ".cjs" }),
  noExternal: [/.*/],
  clean: true,
});
