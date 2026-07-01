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
    environment: "node",
  },
});
