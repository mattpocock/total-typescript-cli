import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  server: {
    watch: {
      ignored: ["**/playground/**"],
    },
  },
});
