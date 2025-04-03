import { empathyco } from '@empathyco/eslint-config'

export default empathyco({
  rules: {
    'ts/no-unsafe-return': 'off',
    'ts/no-unsafe-member-access': 'off',
    'ts/no-unsafe-assignment': 'off',
  },
})
