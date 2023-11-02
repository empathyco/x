import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import Inspector from 'vite-plugin-vue-inspector';
import packageJSON from './package.json';

const vueDocsPlugin = {
  name: 'vue-docs',
  transform(code, id) {
    if (!/vue&type=docs/.test(id)) return;
    return `export default ''`;
  }
};

const dependencies = new Set(
  Object.keys(packageJSON.dependencies).concat(Object.keys(packageJSON.peerDependencies))
);

export default defineConfig({
  plugins: [
    vue(),
    vueDocsPlugin,
    Inspector({
      vue: 2
    })
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  server: {
    port: 8080
  },
  build: {
    rollupOptions: {
      external(id) {
        /*
         Rollup treats by default all node_modules dependencies as external, but will launch a
         warning if you don't manually specify them. In our case apart from the package.json ones,
         we also need to add any dependency that starts with rxjs (due to rxjs having multiple
         entry points), and the vue-runtime-helpers, which is a dependency added by the SFC compiler
         */
        return (
          dependencies.has(id) || // Package.json dependencies
          /* As rxjs has multiple entry points, it needs to be declared this way */
          id.startsWith('rxjs') ||
          /* Vue SFC dependency. Needs to be here because rollup generates a relative import to the
           node_modules folder */
          id.includes('vue-runtime-helpers')
        );
      }
    }
  }
});
