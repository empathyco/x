import { And, When } from 'cypress-cucumber-preprocessor/steps';

// Scenario 2
When('navigating back', () => {
  cy.go(-1);
});

// Scenario 3
When('clicking result in position {int}', (index: number) => {
  cy.getByDataTest('result-link').eq(index).click();
});

// Scenario 4
And("url doesn't contain parameter {string} with value {string}", (key: string, value: string) => {
  cy.location('search').should('not.contain', `${key}=${encodeURIComponent(value)}`);
});

When('selecting store {string}', (store: string) => {
  cy.getByDataTest('store-selector').getByDataTest('dropdown-toggle').click();
  cy.getByDataTest('store-selector').contains(store).click();
});
