import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import Inspector from 'vite-plugin-vue-inspector';

const vueDocsPlugin = {
  name: 'vue-docs',
  transform(code, id) {
    if (!/vue&type=docs/.test(id)) return;
    return `export default ''`;
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
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      'vue-runtime-helpers': 'node_modules/vue-runtime-helpers'
    }
  },
  server: {
    port: 8080
  }
});
