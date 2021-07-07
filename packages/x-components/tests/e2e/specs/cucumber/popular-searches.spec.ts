import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { InstallXOptions } from '../../../../src/x-installer/x-installer/types';

Given(
  'following config: hide session queries {boolean}, requested items {int}, rendered {int}',
  (hideSessionQueries: boolean, maxItemsToRequest: number, maxItemsToRender: number) => {
    const config: InstallXOptions['xModules'] = {
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
    };
    cy.visit('/test/popular-searches', {
      qs: {
        xModules: JSON.stringify(config)
      }
    });
    cy.getByDataTest('popular-searches-max-to-render').clear().type(maxItemsToRender.toString());
  }
);

// Scenario 1
Then(
  'number of popular searches displayed is equal or less than {int}',
  (maxItemsToRender: number) => {
    cy.getByDataTest('popular-search')
      .should('have.length.at.least', 1)
      .and('have.length.at.most', maxItemsToRender);
  }
);

// Scenario 2
When('popular search number {int} is clicked', (popularSearchItem: number) => {
  cy.getByDataTest('popular-search')
    .eq(popularSearchItem)
    .click()
    .invoke('text')
    .as('searchedQuery');
});

And(
  'the clicked popular search is removed from Popular Searches if {boolean} is true',
  function (this: { searchedQuery: string }, hideSessionQueries: boolean) {
    if (!hideSessionQueries) {
      cy.getByDataTest('popular-search').eq(0).should('have.text', this.searchedQuery);
    } else {
      cy.getByDataTest('popular-search').eq(0).should('not.have.text', this.searchedQuery);
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
      cy.getByDataTest('next-query').should('have.length.at.least', 1);
    } else {
      cy.getByDataTest('next-query').should('not.exist');
    }
  });
});

And('related tags for the popular search are displayed', () => {
  if (cy.$$('[data-test = "related-tags"]').length === 1) {
    cy.getByDataTest('related-tag').should('have.length.at.least', 1);
  } else {
    cy.getByDataTest('related-tag').should('not.exist');
  }
});
