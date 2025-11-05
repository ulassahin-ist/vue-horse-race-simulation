import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import * as path from "node:path";

export default defineConfig({
  base: "/ulas-sahin-horse-race/",
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["tests/unit/**/*.spec.js"],
    environment: "jsdom",
    globals: true,
    threads: false,
    pool: "forks",
  },
});
