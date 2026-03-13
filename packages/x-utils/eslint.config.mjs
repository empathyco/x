import { empathyco } from '@empathyco/eslint-config'

export default empathyco(
  {
    rules: {
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-return': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unsafe-function-type': 'off',
      'jsdoc/check-param-names': 'off',
    },
    ignores: ['vitest.config.ts', 'dist'],
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      'ts/no-unsafe-call': 'off',
      'ts/no-unsafe-argument': 'off',
    },
  },
)
