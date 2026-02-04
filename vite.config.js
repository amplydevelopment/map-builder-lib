import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: path.resolve(__dirname, "playground"),
  server: {
    fs: {
      allow: [__dirname],
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    target: "es2020",
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      formats: ["es"],
      fileName: "index",
    },
  },
  resolve: {
    alias: {
      mapbuilder: path.resolve(__dirname, "src/index.js"),
    },
  },
});
