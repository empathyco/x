import { empathyco } from '@empathyco/eslint-config'

export default empathyco(
  {
    ignores: ['vitest.config.ts', 'dist'],
  },
  {
    files: ['**/*.spec.{ts,tsx,js,jsx}'],
    rules: {
      'ts/no-unsafe-assignment': 'off',
    },
  },
)
