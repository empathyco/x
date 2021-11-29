import { Given, And, Then } from 'cypress-cucumber-preprocessor/steps';

// Scenario 1
Given('a URL with query parameter {string}', (query: string) => {
  cy.visit(`/?useMockedAdapter=true&q=${query}`);
});

Then('the search request contains the origin {string}', (origin: string) => {
  cy.wait('@requestWithOrigin')
    .its('request.body')
    .then(JSON.parse)
    .should('have.property', 'origin', origin);
});

Then('navigate back', () => {
  cy.go(-1);
});

// Scenario 2
And('waiting for search request intercept with new origin', () => {
  cy.intercept('https://api.empathy.co/search').as('requestWithOrigin');
});

// Scenario 3
Then('click result in position {int}', (index: number) => {
  cy.getByDataTest('result-link').eq(index).click();
});
