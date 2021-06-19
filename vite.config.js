import { defineConfig } from "vite";

import fvttModuleDev from "vite-fvtt-module-dev";

export default defineConfig({
  build: {
    rollupOptions: {
      input: ["src/main.ts"],
    },
    manifest: true,
  },
  plugins: [fvttModuleDev()],
});
