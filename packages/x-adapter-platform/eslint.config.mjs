import { empathyco } from '@empathyco/eslint-config'

export default empathyco({}, {
  files: ['**/*.spec.{ts,tsx,js,jsx}'],
  rules: {
    'ts/no-unsafe-assignment': 'off',
  },
},)

