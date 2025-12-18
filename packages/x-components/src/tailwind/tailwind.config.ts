import type { Config } from 'tailwindcss'
import tailwind from '@empathyco/x-tailwindcss'

export default {
  content: [
    './public/index.html',
    './src/**/*.vue',
    './node_modules/@empathyco/x-tailwindcss/showcase/**/*.js',
  ],
  theme: {
    // eslint-disable-next-line ts/no-unsafe-assignment
    extend: {
      ...tailwind.theme,
    },
  },
} satisfies Config
