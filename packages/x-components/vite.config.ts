import path from 'node:path'
import fs from 'node:fs'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { dependencies as pkgDeps, peerDependencies as pkgPeerDeps } from './package.json' //with { type: 'json' }
import { viteCssInjectorPlugin } from '../x-archetype-utils/src/build/vite/css-injector-plugin'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
const dependencies = new Set([...Object.keys(pkgDeps), ...Object.keys(pkgPeerDeps)])
import dts from 'vite-plugin-dts'
import { fileURLToPath } from 'node:url'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

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
          whitespace: 'condense',
          comments: false,
        },
      },
    }),
    dts({
      tsconfigPath: './tsconfig.build.json',
    }),
    vueDocsPlugin,
    viteStaticCopy({
      targets: [
        {
          src: 'package.json',
          dest: './',
        },
        {
          src: 'patches',
          dest: './',
        },
      ],
    }),
  ],
  build: {
    minify: false,
    cssMinify: true,
    sourcemap: true,
    cssCodeSplit: true,
    lib: {
      entry: {
        'core/index': r('src/core.entry.ts'),
        ...getXModules(),
        'x-modules.types/index': r('src/x-modules/x-modules.types.ts'),
      },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      output: {
        //preserveModules: true,
      },
      // Package.json dependencies and any rxjs entry point
      external: id => dependencies.has(id) || id.startsWith('rxjs'),
    },
  },
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

function getXModules() {
  const xModulesPath = r('src/x-modules')
  return Object.fromEntries(
    fs
      .readdirSync(xModulesPath)
      .filter(file => fs.statSync(path.join(xModulesPath, file)).isDirectory())
      .map(module => [`${module}/index`, r(`src/x-modules/${module}/index.ts`)]),
  )
}
