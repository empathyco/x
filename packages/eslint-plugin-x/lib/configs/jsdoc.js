// https://github.com/gajus/eslint-plugin-jsdoc

module.exports = {
  jsdoc: {
    extends: ['plugin:jsdoc/recommended'],
    rules: {
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-indentation': 'error',
      'jsdoc/check-param-names': ['warn', { checkDestructured: false }],
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: [
            'internal',
            'alpha',
            'beta',
            'remarks',
            'privateRemarks',
            'typeParam',
            'packageDocumentation'
          ]
        }
      ],
      'jsdoc/empty-tags': 'warn',
      'jsdoc/implements-on-classes': 'off',
      'jsdoc/multiline-blocks': 'warn',
      'jsdoc/newline-after-description': 'error',
      'jsdoc/no-multi-asterisks': 'warn',
      'jsdoc/tag-lines': 'off',
      'jsdoc/require-description': 'error',
      'jsdoc/require-description-complete-sentence': 'warn',
      'jsdoc/require-hyphen-before-param-description': 'error',
      'jsdoc/require-param': ['warn', { checkDestructured: false }],
      'jsdoc/require-param-description': 'warn',
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
