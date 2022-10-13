const { xTailwindPlugin, oldDsPlugin } = require('@empathyco/x-tailwindcss');
const options = require('./src/tailwind/plugin-options');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.vue',
    './node_modules/@empathyco/x-tailwindcss/showcase/**/*.js'
  ],
  prefix: 'x-',
  plugins: [xTailwindPlugin(options), oldDsPlugin],
  // In order to avoid conflicting class names with the old design system while the new XDS is being developed
  // we are disabling all corePlugins from tailwindcss but some of them.
  // You can check that tailwindcss is still working by checking the style of the heading `Test controls`
  // below the `Start` button on the `x-components` internal demo app.
  // See https://github.com/empathyco/x/pull/655#discussion_r948923711
  corePlugins: [
    'alignItems',
    'display',
    'flex',
    'flexDirection',
    'fontSize',
    'fontWeight',
    'gap',
    'lineHeight',
    'textColor'
  ]
};
