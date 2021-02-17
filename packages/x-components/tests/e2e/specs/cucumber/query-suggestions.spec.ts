import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given(
  'following config: hide if equals query {boolean}, requested items {int}',
  (hideIfEqualsQuery: boolean, maxItemsToRequest: number) => {
    cy.visit('/test/query-suggestions', {
      qs: {
        xModules: JSON.stringify({
          querySuggestions: {
            config: {
              hideIfEqualsQuery,
              maxItemsToRequest
            }
          },
          historyQueries: {
            config: {
              hideIfEqualsQuery: false
            }
          }
        })
      }
    });
  }
);

And('no query suggestion are displayed', () => {
  cy.getByDataTest('query-suggestion').should('not.exist');
});

Then('at most {int} query suggestions are displayed', (maxItemsToRequest: number) => {
  cy.getByDataTest('query-suggestion')
    .should('have.length.at.least', 1)
    .and('have.length.at.most', maxItemsToRequest);
});

And('all query suggestions contain the searched query', function (this: { searchedQuery: string }) {
  const wordsInQuery = this.searchedQuery.split(' ');
  cy.getByDataTest('query-suggestion').should(suggestions => {
    suggestions.each((_, e) => {
      for (const word of wordsInQuery) {
        expect(e).to.contain(word);
      }
    });
  });
});

When('query suggestion number {int} is clicked', (querySuggestionItem: number) => {
  cy.getByDataTest('query-suggestion')
    .eq(querySuggestionItem)
    .click()
    .invoke('text')
    .as('searchedQuery');
});

// Scenario 3
Then(
  '{string} term is not included as first query suggestion is {boolean}',
  (query: string, hideIfEqualsQuery: boolean) => {
    if (hideIfEqualsQuery) {
      cy.getByDataTest('query-suggestion').first().should('not.have.text', query);
    } else {
      cy.getByDataTest('query-suggestion').first().should('have.text', query);
    }
  }
);
