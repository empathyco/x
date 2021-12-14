import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('a URL with query parameter {string}', (query: string) => {
  cy.visit(`/?useMockedAdapter=true&q=${query}`);
});

When('first result is clicked', () => {
  cy.getByDataTest('result-link').first().click();
});

When('first promoted is clicked', () => {
  cy.getByDataTest('promoted').first().click();
});

When('first banner is clicked', () => {
  cy.getByDataTest('banner').first().click();
});

When('first redirection is clicked', () => {
  cy.getByDataTest('redirection-link').first().click();
});

When('scrolls down to next page', () => {
  cy.getByDataTest('result-link').last().scrollIntoView();
});

Then('result click tagging request is triggered', () => {
  cy.wait('@clickTagging');
});

Then('query tagging request is triggered', () => {
  cy.wait('@queryTagging');
});

Then('second page query tagging request is triggered', () => {
  cy.wait('@queryTagging').its('request.body').then(JSON.parse).should('have.property', 'page', 2);
});
