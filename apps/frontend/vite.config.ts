import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { join } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, join(process.cwd(), '..', '..'), '')

  return {
    envDir: join(process.cwd(), '..', '..'),
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_TS_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
