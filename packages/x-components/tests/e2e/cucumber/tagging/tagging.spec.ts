import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('a URL with query parameter {string}', (query: string) => {
  cy.visit(`/?useMockedAdapter=true&q=${query}`);
});

Given('a tracking API with a known response', () => {
  cy.intercept('**/track/query', { statusCode: 200 }).as('queryTagging');
  cy.intercept('**/track/click', { statusCode: 200 }).as('clickTagging');
  cy.intercept('**/track/add2cart', { statusCode: 200 }).as('addToCartTagging');
});

When('first result is clicked', () => {
  slowInteraction();
  cy.getByDataTest('result-link').first().click();
});

When('first promoted is clicked', () => {
  slowInteraction();
  cy.getByDataTest('promoted').first().click();
});

When('first banner is clicked', () => {
  slowInteraction();
  cy.getByDataTest('banner').first().click();
});

When('first redirection is clicked', () => {
  slowInteraction();
  cy.getByDataTest('redirection-link').first().should('exist', {}).click();
});

When('scrolls down to next page', () => {
  cy.getByDataTest('result-link').last().scrollIntoView({ easing: 'linear', duration: 2000 });
});

Then('result click tagging request is triggered', () => {
  cy.get('@clickTagging').should('exist');
});

Then('query tagging request should be triggered', () => {
  cy.wait('@queryTagging').should('exist');
});

Then('query tagging request has been triggered', () => {
  cy.get('@queryTagging', { timeout: 0 }).should('exist');
});

Then('second page query tagging request is triggered', () => {
  cy.get('@queryTagging').its('request.body').then(JSON.parse).should('have.property', 'page', 2);
});

Then('results page number {int} is loaded', (page: number) => {
  cy.getByDataTest('search-result').should('have.length', 24 * page);
});

Then('result click tagging includes location {string}', location => {
  cy.get('@clickTagging')
    .its('request.body')
    .then(JSON.parse)
    .should('have.property', 'location', location);
});

Then('url matches {string}', (match: string) => {
  cy.location('pathname').should('match', new RegExp(match));
});

Then('add product to cart tagging request has been triggered', () => {
  cy.wait('@addToCartTagging').should('exist');
});

/**
 * Waits before performing the next iteration to ensure that the {@link XEvent}s quey has
 * been correctly processed.
 */
function slowInteraction(): void {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(250);
}
