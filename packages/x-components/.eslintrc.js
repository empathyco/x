const esLintRules = {
  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  'no-extra-parens': 'error',
  'no-template-curly-in-string': 'error',
  'require-atomic-updates': 'error',
  curly: ['error', 'all'],
  eqeqeq: 'error',
  'no-eval': 'error',
  'require-await': 'error',
  strict: ['error', 'global'],
  'no-restricted-imports': [
    'error',
    {
      paths: ['rxjs', 'rxjs/operators'],
      patterns: ['rxjs/internal/**/*', '**/types/**/*', '**/dist/**/*']
    }
  ]
};

const vuePluginRules = {
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
  'vue/no-v-html': 'off',
  'vue/eqeqeq': 'error',
  'vue/v-on-function-call': 'error'
};

const importPluginRules = {
  'import/no-self-import': 'error'
};

const jestPluginRules = {
  'jest/expect-expect': ['error', { assertFunctionNames: ['expect*'] }],
  'jest/lowercase-name': ['error', { ignore: ['test'] }],
  'jest/no-duplicate-hooks': 'error',
  'jest/no-expect-resolves': 'error',
  'jest/no-test-return-statement': 'error',
  'jest/prefer-hooks-on-top': 'error',
  'jest/require-top-level-describe': 'error',
  'jest/valid-title': 'error'
};

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:vue/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:cypress/recommended',
    '@vue/prettier',
    '@vue/typescript'
  ],
  rules: {
    'prettier/prettier': 'error',
    ...esLintRules,
    ...vuePluginRules,
    ...importPluginRules,
    ...jestPluginRules
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: {
        jest: true
      }
    }
  ]
};
