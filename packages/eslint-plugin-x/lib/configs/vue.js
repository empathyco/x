// https://vuejs.github.io/eslint-plugin-vue/rules/

module.exports = {
  vue: {
    extends: [
      'plugin:vue/recommended',
      'plugin:vuejs-accessibility/recommended',
      '@vue/prettier',
      '@vue/typescript'
    ],
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
      'vue/multi-word-component-names': 'warn',
      'vue/no-template-shadow': 'off',
      'vue/no-v-html': 'off',
      'vue/component-tags-order': 'warn',
      'vue/v-on-function-call': 'error',
      'vue/v-slot-style': 'off',
      'vue/valid-v-slot': 'warn'
    }
  }
};
