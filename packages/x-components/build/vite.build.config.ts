import path from 'path';
import vue from '@vitejs/plugin-vue';
import copy from 'rollup-plugin-copy';
import { defineConfig } from 'vite';
import Inspector from 'vite-plugin-vue-inspector';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import commonjs from 'vite-plugin-commonjs';

import packageJSON from '../package.json';
import { generateEntryFiles } from './rollup-plugins/x-components.rollup-plugin';
const dependencies = new Set(
  Object.keys(packageJSON.dependencies).concat(Object.keys(packageJSON.peerDependencies))
);

export const vueDocsPlugin = {
  name: 'vue-docs',
  transform(code: string, id: string) {
    return !/vue&type=docs/.test(id) ? undefined : `export default ''`;
  }
};
const rootDir = path.resolve(__dirname, '../.');
const buildPath = path.join(rootDir, 'dist');

const jsOutputDirectory = path.join(buildPath, 'js');
const typesOutputDirectory = path.join(buildPath, 'types');
const cssOutputDirectory = path.join(buildPath, 'design-system');
console.log('input dir', path.join(rootDir, 'src/index.ts'));

export default defineConfig({
  plugins: [
    vue(),
    commonjs(),
    cssInjectedByJsPlugin({
      relativeCSSInjection: true
    }),
    vueDocsPlugin,
    Inspector(),
    generateEntryFiles({
      buildPath,
      jsOutputDirectory,
      typesOutputDirectory
    }),
    copy({
      targets: [
        {
          src: ['CHANGELOG.md', 'package.json', 'README.md', 'docs'],
          dest: buildPath
        }
      ],
      hook: 'writeBundle'
    })
  ],
  css: {
    modules: {
      scopeBehaviour: 'local'
    }
  },
  resolve: {
    alias: {
      vue: path.resolve(__dirname, 'node_modules/vue')
    }
  },
  server: {
    port: 8080
  },
  preview: {
    port: 8080
  },
  optimizeDeps: {
    exclude: ['@empathyco/x-components']
  },
  build: {
    sourcemap: true,
    emptyOutDir: true,
    outDir: jsOutputDirectory,
    minify: false,
    cssCodeSplit: true,
    lib: {
      entry: path.resolve(__dirname, '../src/index.ts'),
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external(id) {
        return (
          dependencies.has(id) || // Package.json dependencies
          /* As rxjs has multiple entry points, it needs to be declared this way */
          id.startsWith('rxjs')
        );
      },
      output: {
        globals: {
          vue: 'Vue'
        },
        exports: 'named',
        preserveModules: true,
        entryFileNames: '[name].js'
      }
    }
  }
});
