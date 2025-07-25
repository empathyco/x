import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Inspector from 'vite-plugin-vue-inspector'

export const vueDocsPlugin = {
  name: 'vue-docs',
  transform(code: string, id: string) {
    return !/vue&type=docs/.test(id) ? undefined : `export default ''`
  },
}

export default defineConfig({
  plugins: [vue(), vueDocsPlugin, Inspector()],
  resolve: {
    alias: {
      vue: resolve(__dirname, 'node_modules/vue'),
    },
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    cors: true,
    allowedHosts: true,
  },
  preview: {
    port: 8080,
    host: '0.0.0.0',
    cors: true,
    allowedHosts: true,
  },
  optimizeDeps: {
    exclude: ['@empathyco/x-components'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
})
