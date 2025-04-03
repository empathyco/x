import { empathyco } from '@empathyco/eslint-config'

export default empathyco(
  {
    ignores: ['.loaded_actions', 'vite.config.ts', 'tsconfig.json'],
  },
  {
    files: ['**/*.spec.{ts,tsx,js,jsx}'],
    rules: {
      'ts/unbound-method': 'off',
      'ts/no-unsafe-member-access': 'off',
    },
  },
)

