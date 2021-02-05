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
      selectedPopularSearch = $button.contents().text();
      cy.intercept({
        pathname: Cypress.env('searchRequestURL'),
        query: {
          q: selectedPopularSearch
        }
      }).as('waitForQueryResponsePS');
      cy.intercept({
        pathname: Cypress.env('nextQueriesRequestURL'),
        query: {
          q: selectedPopularSearch
        }
      }).as('waitForNextQueriesResponsePS');
      cy.intercept({
        pathname: Cypress.env('relatedTagsRequestURL'),
        query: {
          q: selectedPopularSearch
        }
      }).as('waitForRelatedTagsResponsePS');
    })
    .then(() => {
      cy.getByDataTest('popular-search').eq(popularSearchItem).click();
    })
    .then(() => {
      cy.wait('@waitForQueryResponsePS');
    });
});
Then('the clicked popular search term is displayed in the search-box', () => {
  cy.getByDataTest('search-input').should('have.value', selectedPopularSearch);
});
And(
  'the clicked popular search is removed from Popular Searches if {boolean} is true',
  (hideSessionQueries: boolean) => {
    if (hideSessionQueries) {
      cy.getByDataTest('popular-search').each(popularSearch => {
        expect(popularSearch.text()).not.to.eq(selectedPopularSearch);
      });
    } else {
      cy.getByDataTest('popular-searches').should('contain', selectedPopularSearch);
    }
  }
);
And(
  // eslint-disable-next-line max-len
  'no new term is displayed in Popular Searches if hideSessionQueries = {boolean} is true and maxItemsToRender = {int} > maxItemsToRequest = {int}',
  (hideSessionQueries: boolean, maxItemsToRender: number, maxItemsToRequest: number) => {
    if (maxItemsToRender >= maxItemsToRequest) {
      if (hideSessionQueries) {
        cy.getByDataTest('popular-search').should('have.length', maxItemsToRequest - 1);
      } else {
        cy.getByDataTest('popular-search').should('have.length', maxItemsToRequest);
      }
    } else {
      cy.getByDataTest('popular-search').should('have.length', maxItemsToRender);
    }
  }
);
And('next queries for the popular search are displayed', () => {
  cy.wait('@waitForNextQueriesResponsePS').then(() => {
    if (cy.$$('[data-test = "next-queries"]').length === 1) {
      cy.getByDataTest('next-query').should('have.length.gt', 0);
    } else {
      cy.getByDataTest('next-query').should('not.exist');
    }
  });
});
And('related tags for the popular search are displayed', () => {
  cy.wait('@waitForRelatedTagsResponsePS').then(() => {
    if (cy.$$('[data-test = "related-tags"]').length === 1) {
      cy.getByDataTest('related-tag').should('have.length.gt', 0);
    } else {
      cy.getByDataTest('related-tag').should('not.exist');
    }
  });
});
And('popular search is displayed in history queries', () => {
  cy.getByDataTest('history-query')
    .should('have.length', 1)
    .and('contain.text', selectedPopularSearch);
});
