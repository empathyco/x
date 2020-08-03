import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import path from 'path';
import del from 'rollup-plugin-delete';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import postcss from 'rollup-plugin-postcss';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import visualizer from 'rollup-plugin-visualizer';
import vue from 'rollup-plugin-vue';

const jsOutputDirectory = path.join(process.cwd(), 'dist');

const postCSSPlugins = [autoprefixer({ grid: true }), cssnano({ preset: 'default' })];

/**
 * Creates a rollup configuration for projects that use X-Components. This configuration can be customized with the options object.
 *
 * @param {boolean} extractCSS - If true, the build will generate a `.css` and a `.js` file.
 * @param {import('rollup').InputOptions} input - Overrides the entry file. Check http://rollupjs.org/guide/en/#input
 * @param {import('rollup').OutputOptions} output - Overrides the output settings. Check http://rollupjs.org/guide/en/#outputdir
 * @param {Record<string, Record<string, unknown>>} plugins - A dictionary that allows overriding specific plugin configurations.
 *
 * @returns {import('rollup').RollupOptions}
 */
export function createConfig({
  extractCSS = false,
  input= path.join(process.cwd(), 'src/main.ts'),
  output,
  plugins= {}
} = {}) {
  /**
   * Merges a default config with the user one coming from this rollup plugin options.
   *
   * @param {string} pluginName - The plugin name for finding the config.
   * @param {Config} defaultConfig - The default config for the plugin
   * @return {Config} The merged config.
   */
  function mergeConfig(pluginName, defaultConfig = {}) {
    return {
      ...defaultConfig,
      ...plugins[pluginName]
    };
  }

  return {
    input,
    output: {
      file: path.join(jsOutputDirectory, 'app.js'),
      format: 'iife',
      sourcemap: true,
      ...output
    },
    plugins: [
      del(
        mergeConfig('del', {
          targets: [`${ jsOutputDirectory }/*`]
        })
      ),
      htmlTemplate(
        mergeConfig('htmlTemplate', {
          template: path.resolve(process.cwd(), 'public/index.html'),
          target: 'index.html'
        })
      ),
      // Resolving plugins
      replace(
        mergeConfig('replace', {
          'process.env.NODE_ENV': JSON.stringify('production')
        })
      ),
      commonjs(mergeConfig('commonjs')),
      resolve(
        mergeConfig('resolve', {
          browser: true
        })
      ),
      // Code transpiling plugins
      vue(
        mergeConfig('vue', {
          css: !extractCSS, // css: false = extract; css: true = no extract.
          needMap: false,
          style: {
            postcssPlugins: postCSSPlugins
          }
        })
      ),
      typescript(
        mergeConfig('typescript', {
          tsconfigOverride: {
            exclude: ['node_modules', '**/*.spec.ts', '*test*']
          }
        })
      ),
      buble(
        mergeConfig('buble', {
          include: ['**/*.js', '**/*.mjs']
        })
      ),
      postcss(
        mergeConfig('postcss', {
          extract: extractCSS,
          plugins: postCSSPlugins
        })
      ),
      sourcemaps(mergeConfig('sourcemaps')),
      terser(
        mergeConfig('terser', {
          output: { comments: false }
        })
      ),
      /* Can't calculate real minified size with `sourcemap: true` and `gzipSize: true`:
       https://github.com/btd/rollup-plugin-visualizer/issues/72 */
      visualizer(mergeConfig('visualizer', { sourcemap: true }))
    ]
  };
}

export default createConfig();
