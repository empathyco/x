/**
 * @fileoverview ESLint, Prettier and standard-version rules and configurations.
 * @author joseac
 */

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { cypress } = require('./configs/cypress');
const { eslint } = require('./configs/eslint');
const { imports } = require('./configs/imports');
const { jest } = require('./configs/jest');
const { jsdoc } = require('./configs/jsdoc');
const { prettier } = require('./configs/prettier');
const { ts } = require('./configs/ts');
const { tsdoc } = require('./configs/tsdoc');
const { vue } = require('./configs/vue');

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

const standard = {
  parserOptions: ts.parserOptions,
  extends: [
    ...prettier.extends,
    ...eslint.extends,
    ...ts.extends
  ],
  rules: {
    ...prettier.rules,
    ...eslint.rules,
    ...ts.rules
  }
};

const recommended = {
  plugins: tsdoc.plugins,
  parserOptions: standard.parserOptions,
  extends: [
    ...standard.extends,
    ...jsdoc.extends,
    ...imports.extends
  ],
  rules: {
    ...standard.rules,
    ...jsdoc.rules,
    ...tsdoc.rules,
    ...imports.rules
  },
  overrides: [
    jest.overrides,
    cypress.overrides
  ],
  settings: {
    ...imports.settings
  }
};

const all = {
  plugins: recommended.plugins,
  parserOptions: recommended.parserOptions,
  extends: [
    ...recommended.extends,
    ...vue.extends
  ],
  rules: {
    ...recommended.rules,
    ...vue.rules
  },
  overrides: recommended.overrides,
  settings: recommended.settings
};

module.exports = {
  env: { node: true },
  configs: {
    standard,
    recommended,
    all
  }
};
