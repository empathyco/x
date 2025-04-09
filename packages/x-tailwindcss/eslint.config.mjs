import { empathyco } from '@empathyco/eslint-config'

export default empathyco({
  rules: {
    // TODO - Try to avoid rules deactivation.
    'vue/no-template-shadow': 'off',
    'ts/no-unsafe-assignment': 'off',
    'ts/restrict-template-expressions': 'off',
    'jsdoc/check-param-names': 'off'
  }
})

