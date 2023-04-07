import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';
import Inspector from 'vite-plugin-vue-inspector';
import glob from 'glob';

const vueDocsPlugin = {
  name: 'vue-docs',
  transform(code, id) {
    if (!/vue&type=docs/.test(id)) return;
    return `export default ''`;
  }
};

function injectDesignSystemPlugin() {
  return {
    name: 'external-css',
    transformIndexHtml: {
      enforce: 'post',
      transform(html, ctx) {
        const styles = glob.sync('src/design-system/**/*.scss').map(style => `./${style}`);
        const finalStyles = styles.reduce((acc, style) => {
          const link = {
            tag: 'link',
            attrs: { rel: 'stylesheet', type: 'text/css', href: `${style}` },
            injectTo: 'head'
          };
          acc.push(link);
          return acc;
        }, []);
        return finalStyles;
      }
    }
  };
}
export default defineConfig({
  plugins: [
    vue(),
    vueDocsPlugin,
    injectDesignSystemPlugin(),
    Inspector({
      vue: 2
    })
  ],
  server: {
    port: 8080
  }
});
