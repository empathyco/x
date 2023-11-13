import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import Inspector from 'vite-plugin-vue-inspector';

const vueDocsPlugin = {
  name: 'vue-docs',
  transform(code: string, id: string) {
    return !/vue&type=docs/.test(id) ? undefined : `export default ''`;
  }
};

export default defineConfig({
  plugins: [
    vue(),
    vueDocsPlugin,
    Inspector({
      vue: 2
    })
  ],
  resolve: {
    alias: {
      'vue-runtime-helpers': 'node_modules/vue-runtime-helpers'
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
