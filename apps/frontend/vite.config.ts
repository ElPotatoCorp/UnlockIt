import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { join } from 'path'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    envDir: join(process.cwd(), '..', '..'),
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    optimizeDeps: {
      include: ['@unlockit/shared'],
    },
    server: {
      host: true,
      port: 5173,
    },
  }
})
