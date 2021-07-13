import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

const skuSearchURL = 'https://api.empathybroker.com/search/v1/query/juguettos/skusearch?*';

Given('no special config for identifier results view', () => {
  cy.visit('/test/identifier-results');
});

When('skusearch request is being intercepted for the query {string}', (query: string) => {
  cy.intercept({
    url: skuSearchURL,
    query: { q: query }
  }).as('searchByIdentifier');
});

Then('skusearch request with query {string} is made', () => {
  cy.wait('@searchByIdentifier');
});
