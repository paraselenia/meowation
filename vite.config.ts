import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";

const isTest = process.env.VITEST !== undefined;

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["build/**", "dist/**", ".wrangler/**", ".react-router/**"],
  },
  lint: {
    ignorePatterns: ["build/**", "dist/**", ".wrangler/**", ".react-router/**"],
  },
  plugins: isTest
    ? [tailwindcss()]
    : [tailwindcss(), cloudflare({ viteEnvironment: { name: "ssr" } }), reactRouter()],
  test: {
    // Vitest v4 compatibility: preserve mock call history.
    // Remove after tests no longer rely on calls from setup or earlier tests.
    // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
    // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
    clearMocks: false,
    environment: "node",
  },
});
