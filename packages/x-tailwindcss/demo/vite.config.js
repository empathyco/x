import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import tailwindcss from 'tailwindcss';
import tailwindcssNesting from 'tailwindcss/nesting';
import { defineConfig, loadEnv } from 'vite';
import tailwindConfig from './tailwind.config.js';

export default defineConfig(({ mode }) => {
  const { env } = loadEnv(mode, process.cwd());

  return {
    css: {
      postcss: {
        plugins: [
          tailwindcss(tailwindConfig),
          tailwindcssNesting(),
          autoprefixer(),
          ...(env === 'production' ? [cssnano()] : [])
        ]
      }
    }
  };
});
