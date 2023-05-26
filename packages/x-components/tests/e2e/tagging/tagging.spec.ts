import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

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
  cy.wait('@clickTagging').should('exist');
});

Then('query tagging request should be triggered', () => {
  cy.wait('@queryTagging').should('exist');
});

Then('second page query tagging request is triggered', () => {
  cy.wait('@queryTagging').its('request.body').then(JSON.parse).should('have.property', 'page', 2);
});

Then('results page number {int} is loaded', (page: number) => {
  cy.getByDataTest('search-result').should('have.length', 24 * page);
});

Then('result click tagging includes location {string}', location => {
  cy.wait('@clickTagging')
    .its('request.body')
    .then(JSON.parse)
    .should('have.property', 'location', location);
});

Then('url matches {string}', (match: string) => {
  cy.location('pathname').should('match', new RegExp(match));
});

When('pdp add to cart button is clicked', () => {
  cy.getByDataTest('pdp-add-to-cart-button').click();
});

Then('add product to cart tagging request is triggered', () => {
  cy.wait('@addToCartTagging').should('exist');
});
