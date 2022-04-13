import * as process from 'process';
import { defineConfig, loadEnv } from 'vite';
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const tailwindcssNesting = require('tailwindcss/nesting');
import tailwindConfig from './tailwind.config.js';
const cssNano = require('cssnano');

export default defineConfig(({ mode }) => {
  const { env } = loadEnv(mode, process.cwd());
  return {
    build: {
      emptyOutDir: false
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          tailwindcss(tailwindConfig),
          tailwindcssNesting(),
          ...(env === 'production' ? [cssNano()] : [])
        ]
      }
    }
  };
});
