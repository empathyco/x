import type { Config } from 'tailwindcss'
import { oldDsPlugin, xTailwindPlugin } from '@empathyco/x-tailwindcss'

export default {
  content: [
    './demo/public/index.html',
    './demo/**/*.vue',
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
  plugins: [xTailwindPlugin({}), oldDsPlugin],
  important: true,
} as Config
