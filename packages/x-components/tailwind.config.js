const { xTailwindPlugin } = require('@empathyco/x-tailwindcss');

module.exports = {
  content: ['./public/index.html', './src/**/*.vue'],
  prefix: 'x-',
  plugins: [xTailwindPlugin({})]
};
