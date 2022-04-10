import { defineConfig } from 'vite';
import autoprefixer = require('autoprefixer');
import tailwindcss = require('tailwindcss');
import tailwindcssNesting = require('tailwindcss/nesting');
import tailwindConfig from './tailwind.config';
import cssNano = require('cssnano');

export default defineConfig(() => {
  return {
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          tailwindcss(tailwindConfig),
          tailwindcssNesting(),
          //process.env.NODE_ENV === 'production' ? cssNano() : false
        ]
      }
    }
  };
});
