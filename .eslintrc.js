module.exports = {
  root: true,
  extends: ['plugin:@empathyco/x/recommended'],
  ignorePatterns: [
    '**/*.d.ts',
    '**/*.js',
    '**/jest.setup.ts',
    '**/dist',
    'packages/search-adapter',
    'packages/eslint-plugin-x'
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './packages/**/tsconfig.eslint.json'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        /*
         * We disable "max-len" rule to ".vue" files because it has some limitations
         * https://github.com/vuejs/vue-eslint-parser#%EF%B8%8F-known-limitations.
         *
         * Instead we use the one that "eslint-plugin-vue" has. This rule understands much better
         * the ".vue" files.
         * It helps us in cases that the "<style>" tag's section has long lines of
         * code.
         * (e.g: "@include foo(background-color, color, $selector: '#{$component-class}__kpi');
         * https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/max-len.md
         */
        'max-len': 'off',
        'vue/max-len': [
          'error',
          {
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
};
