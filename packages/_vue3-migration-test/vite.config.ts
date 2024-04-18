import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { vueDocsPlugin } from '../x-components/vite.config';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const { VITE_VUE_COMPAT_MODE } = process.env;
  const VUE_COMPAT_MODE = Number(VITE_VUE_COMPAT_MODE);
  if (VUE_COMPAT_MODE !== 2 && VUE_COMPAT_MODE !== 3) {
    throw new Error(
      `Invalid VITE_VUE_COMPAT_MODE value ('${VITE_VUE_COMPAT_MODE ?? ''}'), expected '2' | '3'`
    );
  }
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            compatConfig: {
              MODE: VUE_COMPAT_MODE
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
    },
    optimizeDeps: {
      exclude: ['@empathyco/x-components']
    }
  };
});
