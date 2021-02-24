import { Then, When } from 'cypress-cucumber-preprocessor/steps';

let resultsList: string[] = [];
const compoundResultsList: string[] = [];

// History Queries
When('clear history queries button is clicked', () => {
  cy.getByDataTest('clear-history-queries').click();
});

Then(
  'the searched query is displayed in history queries',
  function (this: { searchedQuery: string }) {
    cy.getByDataTest('history-query')
      .should('have.length.at.least', 1)
      .each(historyQuery => expect(historyQuery).to.contain(this.searchedQuery))
      .invoke('text')
      .as('historicalQuery');
  }
);

// Next Queries
Then('next queries are displayed', () => {
  if (cy.$$('[data-test = "next-queries"]').length === 1) {
    cy.getByDataTest('next-query')
      .should('have.length.at.least', 1)
      .invoke('text')
      .as('nextQueries');
  } else {
    cy.getByDataTest('next-query').should('not.exist');
  }
});

// Query Suggestions
Then('query suggestions are displayed', () => {
  cy.getByDataTest('query-suggestion').should('have.length.at.least', 1);
});

// Related Tags
Then('related tags are displayed', () => {
  if (cy.$$('[data-test = "related-tags"]').length === 1) {
    cy.getByDataTest('related-tag').should('have.length.at.least', 1);
  } else {
    cy.getByDataTest('related-tag').should('not.exist');
  }
});

// Results
Then('related results are displayed', () => {
  resultsList = [];
  cy.getByDataTest('result-item')
    .should('have.length.at.least', 1)
    .each($result => {
      resultsList.push($result.text());
    });
});

Then('related results have changed', () => {
  cy.getByDataTest('result-item')
    .should('not.have.length', resultsList.length)
    .each($result => {
      compoundResultsList.push($result.text());
    })
    .then(() => {
      expect(compoundResultsList.every(item => resultsList.includes(item))).to.eq(false);
    });
});

// Search Box
When('a {string} with results is typed', (query: string) => {
  cy.typeQuery(query).then(() => {
    cy.getByDataTest('search-input').invoke('val').as('searchedQuery');
  });
});

When('{string} is searched', (query: string) => {
  cy.searchQuery(query).then(() => {
    cy.getByDataTest('search-input').invoke('val').as('searchedQuery');
  });
});

When('clear search button is pressed', () => {
  cy.clearSearchInput();
});

Then(
  'the searched query is displayed in the search-box',
  function (this: { searchedQuery: string }) {
    cy.getByDataTest('search-input').should('have.value', this.searchedQuery);
  }
);
