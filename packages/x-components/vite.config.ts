import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export const vueDocsPlugin = {
  name: 'vue-docs',
  transform(code: string, id: string) {
    return !/vue&type=docs/.test(id) ? undefined : `export default ''`;
  }
};

export default defineConfig({
  plugins: [vue(), vueDocsPlugin],
  resolve: {
    alias: {
      vue: resolve(__dirname, 'node_modules/vue')
    }
  },
  server: {
    port: 8080
  },
  preview: {
    port: 8080
  },
  optimizeDeps: {
    exclude: ['@empathyco/x-components']
  }
});
