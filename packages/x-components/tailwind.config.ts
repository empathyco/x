import { xTailwindPlugin, oldDsPlugin } from '@empathyco/x-tailwindcss'
import { Config } from 'tailwindcss'

export default {
  content: [
    './public/index.html',
    './src/**/*.vue',
    './node_modules/@empathyco/x-tailwindcss/showcase/**/*.js',
  ],
  prefix: 'x-',
  theme: {
    extend: {
    },
  },
  plugins: [xTailwindPlugin, oldDsPlugin],
  important: true,
} as Config
