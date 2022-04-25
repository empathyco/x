// https://github.com/gajus/eslint-plugin-jsdoc

module.exports = {
  jsdoc: {
    extends: ['plugin:jsdoc/recommended'],
    rules: {
      'jsdoc/check-alignment': 'error',
      'jsdoc/check-indentation': 'error',
      'jsdoc/check-param-names': [
        'error',
        {
          checkDestructured: false,
          useDefaultObjectProperties: false
        }
      ],
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['internal', 'remarks', 'typeParam', 'packageDocumentation']
        }
      ],
      'jsdoc/empty-tags': 'off',
      'jsdoc/implements-on-classes': 'off',
      'jsdoc/multiline-blocks': 'off',
      'jsdoc/newline-after-description': 'error',
      'jsdoc/no-multi-asterisks': 'off',
      'jsdoc/require-description': 'error',
      'jsdoc/require-description-complete-sentence': 'off',
      'jsdoc/require-hyphen-before-param-description': 'error',
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-param-name': 'error',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-returns-check': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/tag-lines': [
        'error',
        'any',
        {
          dropLines: 'true'
        }
      ],
      'jsdoc/valid-types': 'off'
    }
  }
};
