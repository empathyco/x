import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { createQuerySuggestion } from '../../../../src/__stubs__/query-suggestions-stubs.factory';
import { InstallXOptions } from '../../../../src/x-installer/x-installer/types';

// Background
Given('a query suggestions API with a known response', () => {
  cy.intercept('https://api.empathy.co/getSuggestions', req => {
    req.reply({
      suggestions: [
        createQuerySuggestion('lego'),
        createQuerySuggestion('lego marvel'),
        createQuerySuggestion('lego friends'),
        createQuerySuggestion('lego star wars'),
        createQuerySuggestion('lego city'),
        createQuerySuggestion('lego harry potter')
      ]
    });
  }).as('interceptedQuerySuggestions');
});

Given(
  'following config: hide if equals query {boolean}, requested items {int}',
  (hideIfEqualsQuery: boolean, maxItemsToRequest: number) => {
    const config: InstallXOptions['xModules'] = {
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
    };
    cy.visit('/test/query-suggestions?useMockedAdapter=true', {
      qs: {
        xModules: JSON.stringify(config)
      }
    });
  }
);

// Scenario 1
And('no query suggestions are displayed', () => {
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

When('a query suggestions API with no query suggestions', () => {
  cy.intercept('https://api.empathy.co/getSuggestions', req => {
    req.reply({
      suggestions: []
    });
  }).as('interceptedQuerySuggestions');
});

// Scenario 2
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
