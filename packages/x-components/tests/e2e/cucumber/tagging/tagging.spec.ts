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
  cy.getByDataTest('result-link').last().scrollIntoView({ easing: 'linear', duration: 2000 });
});

Then('result click tagging request is triggered', () => {
  cy.get('@clickTagging').should('exist');
});

Then('query tagging request should be triggered', () => {
  cy.wait('@queryTagging');
});

Then('query tagging request has been triggered', () => {
  cy.get('@queryTagging').should('exist');
});

Then('second page query tagging request is triggered', () => {
  cy.wait('@queryTagging').its('request.body').then(JSON.parse).should('have.property', 'page', 2);
});

Then('results page number {int} is loaded', (page: number) => {
  cy.getByDataTest('result-link').should('have.length', 24 * page);
});
