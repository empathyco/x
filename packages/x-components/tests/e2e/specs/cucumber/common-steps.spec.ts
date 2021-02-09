import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

// SearchBox
When('a {string} with results is typed', (query: string) => {
  cy.typeQuery(query).then(() => {
    cy.getByDataTest('search-input').invoke('val').as('searchedQuery');
  });
});
Then(
  'the searched query is displayed in the search-box',
  function (this: { searchedQuery: string }) {
    cy.getByDataTest('search-input').should('have.value', this.searchedQuery);
  }
);

// History Queries
Then(
  'the searched query is displayed in history queries',
  function (this: { searchedQuery: string }) {
    cy.getByDataTest('history-query')
      .should('have.length.at.least', 1)
      .each(historyQuery => expect(historyQuery).to.contain(this.searchedQuery));
  }
);
When('clear history queries button is clicked', () => {
  cy.getByDataTest('clear-history-queries').click();
});

// Results
Then('related results are displayed', () => {
  cy.getByDataTest('result-item').should('have.length.gt', 0);
});

// Query suggestions
And('query suggestions are displayed', () => {
  cy.getByDataTest('query-suggestion').should('have.length.gt', 0);
});
And('next queries are displayed', () => {
  if (cy.$$('[data-test = "next-queries"]').length === 1) {
    cy.getByDataTest('next-query').should('have.length.gt', 0);
  } else {
    cy.getByDataTest('next-query').should('not.exist');
  }
});
And('related tags are displayed', () => {
  if (cy.$$('[data-test = "related-tags"]').length === 1) {
    cy.getByDataTest('related-tag').should('have.length.gt', 0);
  } else {
    cy.getByDataTest('related-tag').should('not.exist');
  }
});
And('data is loaded', () => {
  cy.getByDataTest('loading')
    .should('exist')
    .then(() => cy.getByDataTest('loading').should('not.exist'));
});
