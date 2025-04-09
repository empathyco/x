import { xTailwindPlugin, oldDsPlugin } from '@empathyco/x-tailwindcss'
import { Config } from 'tailwindcss'
import options from './src/tailwind/plugin-options'

export default {
  content: [
    './public/index.html',
    './src/**/*.vue',
    './node_modules/@empathyco/x-tailwindcss/showcase/**/*.js',
  ],
  prefix: 'x-',
  theme: {
    extend: {
      fontFamily: ({ theme }) => theme('x.fontFamily'),
      fontSize: ({ theme }) => theme('x.fontSize'),
      spacing: ({ theme }) => theme('x.spacing'),
      colors: ({ theme }) => theme('x.colors'),
      screens: ({ theme }) => theme('x.screens'),
    },
  },
  plugins: [xTailwindPlugin(options), oldDsPlugin],
  important: true,
} as Config
