const options = require('./options');
const { xTailwindPlugin } = require('@empathyco/x-tailwindcss');

module.exports = {
  xTailwindPlugin: xTailwindPlugin(options)
};
