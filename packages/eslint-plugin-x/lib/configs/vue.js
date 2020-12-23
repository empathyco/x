// https://vuejs.github.io/eslint-plugin-vue/rules/

module.exports = {
  vue: {
    extends: ['plugin:vue/recommended', '@vue/prettier', '@vue/typescript'],
    rules: {
      'vue/attribute-hyphenation': 'off',
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'CONDITIONALS',
            'LIST_RENDERING',
            'UNIQUE',
            'RENDER_MODIFIERS',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'CONTENT',
            'EVENTS',
            'GLOBAL',
            'OTHER_ATTR'
          ]
        }
      ],
      'vue/eqeqeq': 'error',
      'vue/no-template-shadow': 'off',
      'vue/no-v-html': 'off',
      'vue/v-on-function-call': 'error'
    }
  }
};
