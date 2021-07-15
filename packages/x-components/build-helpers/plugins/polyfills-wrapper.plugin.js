import MagicString from 'magic-string';
import { generateWrapperFunctionTuple } from '../utils/polyfills.util';

/**
 * Wraps all the generated code in a condition that checks if polyfills are needed. If so, it requests
 * the specified polyfills to polyfill.io.
 * @param {{condition: Function, polyfills: string[], flags: string[], excludes: string}} pluginOptions - The options for wrapping the
 *   code:
 *  * condition: an arrow function which tests if the polyfills are need.
 *  * polyfills: The polyfills to load.
 *  * flags: polyfills.io flags to use in the request.
 *  * excludes: polyfills.io polyfills to exclude from the main bundle.
 * @returns {import('rollup').Plugin} A rollup plugin
 * @see https://polyfill.io/v3/url-builder/
 */
export default function xComponentsPolyfillsWrapperPlugin(polyfillsOptions) {
  return {
    name: 'XComponents Polyfills Wrapper',
    async renderChunk(code, chunk) {
      if (!chunk.isEntry) {
        return null;
      }
      const appMagicString = new MagicString(code);
      const [header, footer] = generateWrapperFunctionTuple(polyfillsOptions);

      appMagicString
        .prepend(`(${ header }`)
        .append(`${ footer })()`);

      return {
        code: appMagicString.toString(),
        map: appMagicString.generateMap({ hires: true })
      };
    }
  };
};
