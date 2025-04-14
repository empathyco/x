import { empathyco } from '@empathyco/eslint-config'

export default empathyco(
  {
    rules: {
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-return': 'off',
    },
  },
  {
    files: ['**/*.spec.{ts,tsx,js,jsx}'],
    rules: {
      'ts/no-floating-promises': 'off',
    },
  },
)
