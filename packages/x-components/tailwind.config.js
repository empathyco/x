const { xTailwindPlugin } = require('@empathyco/x-tailwindcss');

module.exports = {
  content: [
    './index.html',
    './src/components/**/*.vue',
    './src/views/**/*.vue',
    './src/x-modules/**/components/**/*.vue'
  ],
  prefix: 'x-',
  plugins: [xTailwindPlugin({})]
};
