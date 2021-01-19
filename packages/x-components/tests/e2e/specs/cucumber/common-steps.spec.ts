import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

When('a {string} with results is typed', (query: string) => {
  cy.typeQuery(query);
  cy.intercept({
    pathname: Cypress.env('searchRequestURL'),
    query: {
      q: query
    }
  }).as('waitForQueryResponse');
  cy.intercept({
    pathname: Cypress.env('nextQueriesRequestURL'),
    query: {
      q: query
    }
  }).as('waitForNextQueriesResponse');
  cy.intercept({
    pathname: Cypress.env('relatedTagsRequestURL'),
    query: {
      q: query
    }
  }).as('waitForRelatedTagsResponse');
});
Then('related results are displayed', () => {
  cy.getByDataTest('result-item').should('have.length.gt', 0);
});
And('query suggestions are displayed', () => {
  cy.getByDataTest('query-suggestion').should('have.length.gt', 0);
});
And('next queries are displayed', () => {
  cy.wait('@waitForNextQueriesResponse').then(() => {
    if (cy.$$('[data-test = "next-queries"]').length === 1) {
      cy.getByDataTest('next-query').should('have.length.gt', 0);
    } else {
      cy.getByDataTest('next-query').should('not.exist');
    }
  });
});
And('related tags are displayed', () => {
  cy.wait('@waitForRelatedTagsResponse').then(() => {
    if (cy.$$('[data-test = "related-tags"]').length === 1) {
      cy.getByDataTest('related-tag').should('have.length.gt', 0);
    } else {
      cy.getByDataTest('related-tag').should('not.exist');
    }
  });
});
