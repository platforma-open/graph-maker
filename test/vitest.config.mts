import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: false,
    testTimeout: 10000,
    // Block test runs against a CI-provisioned pl backend whose cold start has no
    // readiness gate (pl-compose `sleep 1`); retries absorb the startup race.
    retry: 2,
  },
});
