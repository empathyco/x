// https://github.com/gajus/eslint-plugin-jsdoc

module.exports = {
  jsdoc: {
    extends: ['plugin:jsdoc/recommended'],
    rules: {
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-indentation': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['internal', 'alpha', 'beta', 'remarks', 'typeParam', 'packageDocumentation']
        }
      ],
      'jsdoc/implements-on-classes': 'off',
      'jsdoc/newline-after-description': 'error',
      'jsdoc/require-description': 'error',
      'jsdoc/require-description-complete-sentence': 'error',
      'jsdoc/require-hyphen-before-param-description': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-param-name': 'error',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-check': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/valid-types': 'off'
    }
  }
};
