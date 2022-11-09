import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import tailwindcssNesting from 'tailwindcss/nesting';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import tailwindConfig from './tailwind.config';

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss(tailwindConfig), tailwindcssNesting(), autoprefixer()]
    }
  },
  plugins: [createVuePlugin()]
});
