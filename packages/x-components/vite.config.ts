import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Inspector from 'vite-plugin-vue-inspector'
import { viteCssInjectorPlugin } from '../x-archetype-utils/src/build/vite/css-injector-plugin'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export const vueDocsPlugin = {
  name: 'vue-docs',
  transform(code: string, id: string) {
    return !/vue&type=docs/.test(id) ? undefined : `export default ''`
  },
}

export default defineConfig({
  plugins: [
    viteCssInjectorPlugin(),
    cssInjectedByJsPlugin({
      dev: {
        enableDev: true,
      },
      injectCode: (cssCode: string) => `(window.xCSSInjector ??= []).push(${cssCode});`
    }),
    vue({
      features: {
        customElement: true,
      },
      template: {
        compilerOptions: {
          comments: false,
        },
      },
    }),
    vueDocsPlugin,
    //Inspector(),
  ],
  server: {
    port: 8080,
    host: '0.0.0.0',
    cors: true,
    allowedHosts: true,
  },
  preview: {
    port: 8080,
    host: '0.0.0.0',
    cors: true,
    allowedHosts: true,
  },
  optimizeDeps: {
    exclude: ['@empathyco/x-components'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
})
