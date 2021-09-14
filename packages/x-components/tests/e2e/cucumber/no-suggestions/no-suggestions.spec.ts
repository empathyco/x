import { And, Given } from 'cypress-cucumber-preprocessor/steps';

Given('a suggestion API with no results', () => {
  cy.intercept('https://api.empathy.co/getSuggestions', req => {
    req.reply({
      suggestions: []
    });
  }).as('interceptedNoQuerySuggestions');
});

And('no special config for no-suggestions view', () => {
  cy.visit('/test/no-suggestions?useMockedAdapter=true');
});

And('no-suggestions message is displayed for {string}', (queryWithoutSuggestions: string) => {
  cy.getByDataTest('no-suggestions')
    .should('exist')
    .children()
    .should('contain', queryWithoutSuggestions)
    .click();
});

And('no-suggestions message is not displayed', () => {
  cy.getByDataTest('no-suggestions').should('not.exist');
});
