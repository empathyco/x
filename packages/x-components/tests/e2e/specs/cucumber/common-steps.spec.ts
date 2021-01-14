import { And, Then } from 'cypress-cucumber-preprocessor/steps';

Then('related results are displayed', () => {
  cy.getByDataTest('result-item').should('have.length.gt', 0);
});
And('query suggestions are displayed', () => {
  cy.getByDataTest('query-suggestion').should('have.length.gt', 0);
});
And('next queries are displayed', () => {
  cy.getByDataTest('next-query').should('have.length.gt', 0);
});
And('related tags are displayed', () => {
  cy.getByDataTest('related-tag').should('have.length.gt', 0);
});
