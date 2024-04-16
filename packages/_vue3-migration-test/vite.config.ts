import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { vueDocsPlugin } from '../x-components/vite.config';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 3
          }
        }
      }
    }),
    vueDocsPlugin
  ],
  resolve: {
    alias: {
      vue: resolve(__dirname, 'node_modules/@vue/compat')
    }
  }
});
