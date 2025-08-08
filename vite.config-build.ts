// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: "src/components/index.tsx",
      name: "WidgetsRenderer",
      fileName: (format) => `widgets-renderer.${format}.js`,
    },
    rollupOptions: {
      plugins: [
        nodeResolve({
          dedupe: [
            "useTranslation",
            "i18n",
            "I18nextProvider",
            "LocalizationProvider",
            "DataProvider",
          ],
        }),
      ],
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
