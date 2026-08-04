// @lovable.dev/vite-tanstack-config already includes default plugins
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts
export default defineConfig({
  vite: {
    server: {
      open: true,
      host: true,
      port: 8080,
      allowedHosts: [
        'intranet.grupogobr.com.br',
        'localhost',
        '127.0.0.1'
      ],
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/uploads': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    },
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
