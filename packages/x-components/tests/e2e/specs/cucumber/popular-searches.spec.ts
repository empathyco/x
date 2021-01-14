import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

let selectedPopularSearch: string;

// Scenario 1
Given(
  'following config: hide session queries {boolean}, requested items {int}, rendered {int}',
  (hideSessionQueries: boolean, maxItemsToRequest: number, maxItemsToRender: number) => {
    cy.visit('/test/popular-searches', {
      qs: {
        xModules: JSON.stringify({
          popularSearches: {
            config: {
              hideSessionQueries,
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
    cy.getByDataTest('popular-searches-max-to-render').clear().type(maxItemsToRender.toString());
  }
);
Then(
  'number of popular searches displayed is equal or less than {int}',
  (maxItemsToRender: number) => {
    cy.getByDataTest('popular-search').should('have.length.lte', maxItemsToRender);
  }
);

// Scenario 2
When('popular search number {int} is clicked', (popularSearchItem: number) => {
  cy.getByDataTest('popular-search')
    .eq(popularSearchItem)
    .then($button => {
      selectedPopularSearch = $button.text();
    })
    .click();
});
Then('the clicked popular search term is displayed in the search-box', () => {
  cy.getByDataTest('search-input').should('have.value', selectedPopularSearch);
});
And(
  'the clicked popular search is removed from Popular Searches if {boolean} is true',
  (hideSessionQueries: boolean) => {
    if (hideSessionQueries) {
      cy.getByDataTest('popular-searches').should('not.contain', selectedPopularSearch);
    } else {
      cy.getByDataTest('popular-searches').should('contain', selectedPopularSearch);
    }
  }
);
And(
  // eslint-disable-next-line max-len
  'no new term is displayed in Popular Searches if hideSessionQueries = {boolean} is true and maxItemsToRender = {int} > maxItemsToRequest = {int}',
  (hideSessionQueries: boolean, maxItemsToRender: number, maxItemsToRequest: number) => {
    if (hideSessionQueries) {
      if (maxItemsToRender >= maxItemsToRequest) {
        cy.getByDataTest('popular-search').should('have.length', maxItemsToRequest - 1);
      } else {
        cy.getByDataTest('popular-search').should('have.length', maxItemsToRender);
      }
    } else {
      cy.getByDataTest('popular-search').should('have.length', maxItemsToRender);
    }
  }
);
And('popular search is displayed in history queries', () => {
  cy.getByDataTest('history-query')
    .should('have.length', 1)
    .and('contain.text', selectedPopularSearch);
});
