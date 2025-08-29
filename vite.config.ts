import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import terser from "@rollup/plugin-terser";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {},
    // React 19 compatibility
    __DEV__: false,
  },
  plugins: [react(), terser()],
  build: {
    outDir: "dist",
    manifest: true,
    minify: "terser",
    lib: {
      entry: "src/components/index.tsx",
      name: "WidgetsRenderer",
      formats: ["es"],
      fileName: "widgets-renderer",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        compact: true,
        inlineDynamicImports: false,
        format: "es",
        minifyInternalExports: true,
        entryFileNames: "[name]-[hash].js",
        assetFileNames: "[name]-[hash].[ext]",
        chunkFileNames: "[name]-[hash].js",
      },
    },
  },
});
