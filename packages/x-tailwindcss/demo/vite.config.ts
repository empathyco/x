import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindcss from 'tailwindcss';
import tailwindcssNesting from 'tailwindcss/nesting';
import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import xTailwindCss from '../src/x-tailwind-plugin/plugin';

export default defineConfig(({ mode }) => {
  return {
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            content: ['./index.html', './**/*.vue'],
            prefix: 'x-',
            important: true,
            theme: {
              extend: {}
            },
            plugins: [
              xTailwindCss({
                components() {
                  return {};
                },
                utilities() {
                  return {};
                },
                dynamicUtilities() {
                  return {};
                },
                dynamicComponents() {
                  return {};
                },
                theme: {}
              })
            ]
          }),
          tailwindcssNesting(),
          autoprefixer(),
          ...(mode === 'production' ? [cssnano()] : [])
        ]
      }
    },
    plugins: [createVuePlugin()]
  };
});
