import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { InstallXOptions } from '../../../src/x-installer/x-installer/types';

// Background
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
    cy.visit('/', {
      qs: {
        xModules: JSON.stringify(config)
      }
    });
    cy.getByDataTest('popular-searches-max-to-render').clear().type(maxItemsToRender.toString());
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

Then(
  'the clicked popular search is removed from Popular Searches if {boolean} is true',
  function (hideSessionQueries: boolean) {
    if (!hideSessionQueries) {
      cy.getByDataTest('popular-search').eq(0).should('have.text', this.searchedQuery);
    } else {
      cy.getByDataTest('popular-search').eq(0).should('not.have.text', this.searchedQuery);
    }
  }
);

Then(
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
