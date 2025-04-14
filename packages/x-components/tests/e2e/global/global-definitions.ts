import { defineParameterType } from '@badeball/cypress-cucumber-preprocessor'

defineParameterType({
  name: 'boolean',
  regexp: /true|false/,
  transformer(string) {
    return string === 'true'
  },
})
