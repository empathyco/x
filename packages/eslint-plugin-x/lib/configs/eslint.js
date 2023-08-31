// https://eslint.org/docs/rules/

module.exports = {
  eslint: {
    extends: ['eslint:recommended'],
    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      indent: 'off',
      // THESE 'max-len' rules ARE ALMOST THE SAME OVERRIDE CONFIG THAT IS SET IN x-components/.eslintrc.js for vue files, except the ignorePattern, so we will override it below in vue files
      'max-len': ['error', { code: 100, ignoreComments: false, ignorePattern: 'class=".*"$' }],
      'no-alert': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-dupe-class-members': 'off',
      'no-duplicate-imports': 'error',
      'no-empty-function': 'off',
      'no-eval': 'error',
      'no-extra-parens': 'off',
      'no-restricted-imports': ['error', { patterns: ['rxjs/internal/**/*', '**/dist/**/*'] }],
      'no-template-curly-in-string': 'error',
      'no-unused-expressions': 'off',
      'no-unused-vars': 'off',
      'require-atomic-updates': 'error',
      'require-await': 'error',
      strict: ['error', 'global']
    },
    overrides: [
      {
        files: ['src/**/*.vue'],
        rules: {
          /*
           * We use 'vue/max-len' that "eslint-plugin-vue" has. This rule understands much better
           * the ".vue" files.
           * It helps us in cases that the "<style>" tag's section has long lines of
           * code.
           * (e.g: "@include foo(background-color, color, $selector: '#{$component-class}__kpi');
           * https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/max-len.md
           */
          'vue/max-len': [
            'error',
            {
              ignorePattern: '|class=".*"$ |https://github',
              ignoreStrings: true,
              ignoreTemplateLiterals: true,
              ignoreUrls: true,
              /*
               * "ignoreHTMLAttributeValues" helps us when an attribute is too long, and it does not fit in the defined max-len
               * but prettier wouldn't want to wrap it in multiple lines.
               * Pretty useful when the "class" attribute is too long.
               * e.g:
               * - "<div  class="example-component example-component--expanded">.
               * - "<path
               *     d="M11 .5c-1.7.2-3.4.9-4.7 2-1.1.9-2 2-2.5 3.2-1.2 2.4-1.2 5.1-.1 7.7 1.1 2.6 2.8 5 5.3 7.5 1.2 1.2 2.8 2.7 3 2.7 0 0
               *    />"
               *
               * Previously prettier would have formatted this with one class per line. like so:
               * "<div class="example-component
               *             example-component--expanded"
               * >"
               * But it is no longer an option since prettier@2.5.0.
               * https://prettier.io/blog/2021/11/25/2.5.0.html#collapse-html-class-attributes-onto-one-line-11827httpsgithubcomprettierprettierpull11827-by-jlongsterhttpsgithubcomjlongster
               */
              ignoreHTMLAttributeValues: true
            }
          ]
        }
      }
    ]
  }
};
