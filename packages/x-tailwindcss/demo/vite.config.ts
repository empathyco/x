import { resolve } from 'path';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import tailwindcssNesting from 'tailwindcss/nesting';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindConfig from './tailwind.config';

export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../showcase')
  },
  css: {
    postcss: {
      plugins: [tailwindcss(tailwindConfig), tailwindcssNesting(), autoprefixer()]
    }
  },
  plugins: [vue()]
});
