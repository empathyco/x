/**
 * Generates a tuple with the code of the wrapping function. This tuple will contain two strings,
 * and the code to wrap should be inserted between them.
 *
 * @param condition - an arrow function which tests if the polyfills are needed.
 * @param polyfills - The polyfills to load.
 * @param flags - polyfills.io flags to use in the request.
 * @param excludes - polyfills.io polyfills to exclude from the main bundle.
 * @param options - An object ot override the snippet options, to use in exceptional cases.
 * @return {[string, string]} A tuple containing the header and the footer parts for inserting the
 *   code between them.
 */
export function generateWrapperFunctionTuple({
  condition = () =>
    Array.from &&
    Array.prototype.fill &&
    String.prototype.includes &&
    String.prototype.startsWith &&
    navigator.sendBeacon &&
    typeof fetch === 'function',
  polyfills = [
    'Array.prototype.includes',
    'Array.prototype.forEach',
    'es6',
    'Object.entries',
    'Object.values',
    'URL',
    'navigator.sendBeacon',
    'Symbol',
    'fetch'
  ],
  flags = ['gated'],
  excludes = '',
  options = {}
} = {}) {
  const wrapperFunction = function () {
    if (condition) {
      loadXComponents();
    } else {
      var polyfillsScript = document.createElement('script');
      polyfillsScript.src = 'polyfills-url';
      polyfillsScript.onload = loadXComponents;
      document.body.appendChild(polyfillsScript);
    }

    async function loadXComponents() {
      /* <InsertXComponents> */
      const overrideOptions = options;
      if (window.initX !== undefined) {
        const snippetOptions = typeof window.initX === 'function' ? window.initX() : window.initX;
        window.X.init({ ...snippetOptions, ...overrideOptions });
      }
    }
  };

  const polyfillsURL = 'https://cdn.polyfill.io/v3/polyfill.min.js'.concat(
    `?features=${polyfills.join(',')}`,
    `&flags=${flags.join(',')}`,
    excludes ? `&excludes=${excludes}` : ``
  );

  return wrapperFunction
    .toString()
    .replace('condition', condition.toString().replace('() =>', ''))
    .replace('polyfills-url', polyfillsURL)
    .replace('options', JSON.stringify(options))
    .split('/* <InsertXComponents> */');
}
