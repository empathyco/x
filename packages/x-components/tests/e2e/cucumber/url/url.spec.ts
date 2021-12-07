import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

// Scenario 1
Given('a URL with query parameter {string}', (query: string) => {
  cy.visit(`/?useMockedAdapter=true&q=${query}`);
});

Then('the search request contains the origin {string}', (origin: string) => {
  cy.wait('@interceptedResults')
    .its('request.body')
    .then(JSON.parse)
    .should('have.property', 'origin', origin);
});

// Scenario 2
When('navigating back', () => {
  cy.go(-1);
});

// Scenario 3
When('clicking result in position {int}', (index: number) => {
  cy.getByDataTest('result-link').eq(index).click();
});
