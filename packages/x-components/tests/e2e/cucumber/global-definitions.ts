import { defineParameterType } from 'cypress-cucumber-preprocessor/steps';

defineParameterType({
  name: 'boolean',
  regexp: /true|false/,
  transformer(string) {
    return string === 'true';
  }
});

defineParameterType({
  name: 'intArray',
  regexp: /\[[0-9]+(,\s?[0-9]+)*]/,
  transformer(string) {
    return string.slice(1, -1).split(',').map(Number);
  }
});
