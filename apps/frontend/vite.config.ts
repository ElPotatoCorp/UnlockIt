import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import { join } from 'path';
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  envDir: join(process.cwd(), '..', '..'),
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    viteCompression({ algorithm: "brotliCompress", ext: ".br" }),
    viteCompression({ algorithm: "gzip" })
  ],
  optimizeDeps: {
    include: ['@unlockit/shared'],
  },
  server: {
    host: true,
    port: 5173,
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rolldownOptions: {
      plugins: [
        visualizer({
          filename: "stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
        })
      ],
      output: {
        manualChunks(id) {
          const path = id.replace(/\\/g, "/");

          // React core
          if (path.includes("/node_modules/react/")) return "react";
          if (path.includes("/node_modules/react-dom/")) return "react";
          if (path.includes("/node_modules/scheduler/")) return "react";

          // React Router
          if (path.includes("/node_modules/react-router/")) return "router";
          if (path.includes("/node_modules/react-router-dom/")) return "router";

          // Helmet
          if (path.includes("/node_modules/react-helmet-async/")) return "helmet";

          // Vendor libs
          if (path.includes("/node_modules/zustand/")) return "vendor";
          if (path.includes("/node_modules/use-debounce/")) return "vendor";
          if (path.includes("/node_modules/shallowequal/")) return "vendor";
          if (path.includes("/node_modules/react-fast-compare/")) return "vendor";
          if (path.includes("/node_modules/react-hook-form/")) return "vendor";

          // UI
          if (path.includes("/src/components/ui/")) return "ui";
          if (path.includes("/src/components/common/")) return "ui";

          // API layer
          if (path.includes("/src/api/")) return "api";

          // PixiJS
          if (path.includes("/node_modules/pixi.js/")) return "pixi";
        }
      }
    }
  },
})