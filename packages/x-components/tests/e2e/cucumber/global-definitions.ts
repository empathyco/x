import { defineParameterType } from 'cypress-cucumber-preprocessor/steps';

defineParameterType({
  name: 'boolean',
  regexp: /true|false/,
  transformer(string) {
    return string === 'true';
  }
});
