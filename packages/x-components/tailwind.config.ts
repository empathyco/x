import { xTailwindPlugin, oldDsPlugin } from '@empathyco/x-tailwindcss';
import { Config } from 'tailwindcss';
import options from './src/tailwind/plugin-options';

export default {
  content: [
    './public/index.html',
    './src/**/*.vue',
    './node_modules/@empathyco/x-tailwindcss/showcase/**/*.js'
  ],
  prefix: 'x-',
  plugins: [xTailwindPlugin(options), oldDsPlugin]
} as Config;
