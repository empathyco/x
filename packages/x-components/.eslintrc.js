module.exports = {
  extends: ['plugin:@empathyco/x/all'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json'
  },
  rules: {
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-unused-vars-experimental': 'off',
    'vuejs-accessibility/alt-text': 'error',
    'vuejs-accessibility/anchor-has-content': 'warn',
    'vuejs-accessibility/aria-props': 'warn',
    'vuejs-accessibility/aria-role': 'warn',
    'vuejs-accessibility/aria-unsupported-elements': 'warn',
    'vuejs-accessibility/click-events-have-key-events': 'warn',
    'vuejs-accessibility/form-control-has-label': 'warn',
    'vuejs-accessibility/heading-has-content': 'warn',
    'vuejs-accessibility/iframe-has-title': 'warn',
    'vuejs-accessibility/interactive-supports-focus': 'warn',
    'vuejs-accessibility/label-has-for': 'warn',
    'vuejs-accessibility/media-has-caption': 'warn',
    'vuejs-accessibility/mouse-events-have-key-events': 'warn',
    'vuejs-accessibility/no-access-key': 'warn',
    'vuejs-accessibility/no-autofocus': 'warn',
    'vuejs-accessibility/no-distracting-elements': 'warn',
    'vuejs-accessibility/no-onchange': 'warn',
    'vuejs-accessibility/no-redundant-roles': 'warn',
    'vuejs-accessibility/role-has-required-aria-props': 'warn',
    'vuejs-accessibility/tabindex-no-positive': 'warn'
  }
};
