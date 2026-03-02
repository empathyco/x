import { empathyco } from '@empathyco/eslint-config'

export default empathyco(
  {
    rules: {
      'jsdoc/check-param-names': 'off',
    },
    ignores: ['vitest.config.ts', 'dist'],
  },
  {
    files: ['**/*.spec.{ts,tsx,js,jsx}'],
    rules: {
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unsafe-return': 'off',
      'ts/no-unsafe-call': 'off',
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-argument': 'off',
    },
  },
)
