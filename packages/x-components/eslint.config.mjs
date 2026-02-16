import { empathyco } from '@empathyco/eslint-config'

export default empathyco(
  {
    ignores: ['.loaded_actions', 'vite.config.ts', 'jest.setup.ts', 'cypress.config.ts'],
  },
  {
    files: ['**/*.spec.{ts,tsx,js,jsx}'],
    rules: {
      'ts/unbound-method': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-return': 'off',
      'ts/no-unsafe-argument': 'off',
    },
  },
  {
    rules: {
      // Sync doc interface with API Extractor
      'jsdoc/check-param-names': 'off',
    },
  },
)
