import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {},
  },
  plugins: [react()],
  build: {
    outDir: "dist",
    manifest: true,
    lib: {
      entry: "src/components/index.tsx",
      name: "ecom-components",
      formats: ["es"],
      // fileName: 'index'
    },
    rollupOptions: {
      // external: ['react', 'react-dom'],
      output: {
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
