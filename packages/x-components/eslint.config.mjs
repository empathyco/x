import { empathyco } from '@empathyco/eslint-config'

export default empathyco(
  {
    ignores: ['.loaded_actions'],
  },
  {
    files: ['**/*.spec.{ts,tsx,js,jsx}', '**/__tests__/**/*.ts'],
    rules: {
      'ts/unbound-method': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-return': 'off',
      'ts/no-unsafe-argument': 'off',
      'ts/no-unsafe-call': 'off',
    },
  },
  {
    rules: {
      // Sync doc interface with API Extractor
      'jsdoc/check-param-names': 'off',
    },
  },
)
