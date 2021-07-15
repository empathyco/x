import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { InstallXOptions } from '../../../src/x-installer/x-installer/types';

let historyQueriesList: string[];

Given(
  // eslint-disable-next-line max-len
  'following config: hide if equals query {boolean}, debounce {int}, requested items {int}, rendered {int}, instant search {boolean}',
  (
    hideIfEqualsQuery: boolean,
    debounceInMs: number,
    maxItemsToStore: number,
    maxItemsToRender: number,
    instant: boolean
  ) => {
    const config: InstallXOptions['xModules'] = {
      historyQueries: {
        config: {
          hideIfEqualsQuery,
          debounceInMs,
          maxItemsToStore
        }
      }
    };
    cy.visit('/test/history-queries', {
      qs: {
        xModules: JSON.stringify(config)
      }
    }).then(() => {
      cy.getByDataTest('history-queries-max-to-render').clear().type(maxItemsToRender.toString());
      if (!instant) {
        cy.getByDataTest('search-input-instant').uncheck();
      } else {
        cy.getByDataTest('search-input-instant').check();
      }
    });
  }
);

// Scenario 1
And('a {string} of queries already searched', (list: string) => {
  historyQueriesList = list.split(', ');
  cy.searchQueries(...historyQueriesList);
  cy.clearSearchInput();
});

When('history query number {int} is clicked', (historyQueryItem: number) => {
  cy.getByDataTest('history-query').eq(historyQueryItem).click().invoke('text').as('searchedQuery');
});

And(
  'the searched query is not displayed in history queries if {boolean} is true',
  function (this: { searchedQuery: string }, hideIfEqualsQuery: boolean) {
    if (!hideIfEqualsQuery) {
      cy.getByDataTest('history-query').eq(0).should('have.text', this.searchedQuery);
    } else {
      cy.getByDataTest('history-query').eq(0).should('not.have.text', this.searchedQuery);
    }
  }
);

// Scenario 2
When('the delete button of {int} is clicked', (historyQueryItem: number) => {
  cy.getByDataTest('history-query')
    .eq(historyQueryItem)
    .invoke('text')
    .as('deletedHistoryQuery')
    .then(() => {
      cy.getByDataTest('remove-history-query').eq(historyQueryItem).click();
    });
});

Then(
  'the deleted history query is removed from history queries',
  function (this: { deletedHistoryQuery: string }) {
    cy.getByDataTest('history-query').should(historicalQueries => {
      historicalQueries.each((_, e) => {
        expect(e).to.not.have.text(this.deletedHistoryQuery);
      });
    });
  }
);

And(
  'the number of rendered history queries is {int} - 1 if {int} < {int}',
  (maxItemsToRender: number, maxItemsToStore: number) => {
    if (maxItemsToRender >= maxItemsToStore) {
      cy.getByDataTest('history-query').should('have.length', maxItemsToStore - 1);
    } else {
      cy.getByDataTest('history-query').should('have.length', maxItemsToRender);
    }
  }
);

// Scenario 3
Then('no history queries are displayed', () => {
  cy.getByDataTest('history-queries').should('not.exist');
});

And('clear history queries button is disabled', () => {
  cy.getByDataTest('clear-history-queries').should('be.disabled');
});

// Scenario 4
And('clear search button is clicked', () => {
  cy.clearSearchInput();
});

Then(
  '{string} is deleted from history queries, whereas {string} remains',
  (query: string, followingQuery: string) => {
    cy.getByDataTest('history-query').should(historicalQueries => {
      historicalQueries.each((_, e) => {
        expect(e).to.contain(query + followingQuery);
        expect(e).not.to.equal(query);
      });
    });
  }
);

// Scenario 5
Then(
  'no history queries are displayed after {int} ms if {boolean} is false',
  (debounceInMs: number, instant: boolean) => {
    cy.wait(debounceInMs);
    cy.clearSearchInput();
    if (!instant) {
      cy.getByDataTest('history-query').should('not.exist');
    } else {
      cy.getByDataTest('history-query').should('exist');
    }
  }
);

And('intro is pressed', () => {
  cy.getByDataTest('search-input').type('{enter}');
});

// Scenario 6
Then(
  // eslint-disable-next-line max-len
  'displayed history queries are min of number of queries already searched, max requested items {int}, max rendered items {int}',
  (maxItemsToStore: number, maxItemsToRender: number) => {
    const queriesToDisplay = Math.min(historyQueriesList.length, maxItemsToStore, maxItemsToRender);
    cy.getByDataTest('history-query').should('have.length', queriesToDisplay);
  }
);

Then(
  'the searched query is removed from {int} position in history queries',
  function (this: { searchedQuery: string }, historyQueryItem: number) {
    cy.getByDataTest('history-query')
      .eq(historyQueryItem)
      .should('not.have.text', this.searchedQuery);
  }
);

And(
  'the searched query is the first item in history queries',
  function (this: { searchedQuery: string }) {
    cy.getByDataTest('history-query').first().should('have.text', this.searchedQuery);
  }
);
