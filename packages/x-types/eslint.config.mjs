import { empathyco } from '@empathyco/eslint-config'

export default empathyco(
  { ignores: ['vite.config.mts'] },
  {},
  {
    rules: {
      'ts/no-unsafe-assignment': 'off',
    },
  },
)
