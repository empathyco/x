import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { InstallXOptions } from '../../../../src/x-installer/x-installer/types';
import { createSuggestionStub } from '../../../../src/__stubs__/suggestions-stubs.factory';

// Background
And('a popular searches API with a known response', () => {
  cy.intercept('https://api.empathy.co/getSuggestions', req => {
    req.reply({
      suggestions: [
        createSuggestionStub('playmobil'),
        createSuggestionStub('lego'),
        createSuggestionStub('mochila'),
        createSuggestionStub('barbie'),
        createSuggestionStub('dinosaurio')
      ]
    });
  }).as('interceptedPopularSearches');
});

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
    cy.visit('/test/popular-searches?useMockedAdapter=true', {
      qs: {
        xModules: JSON.stringify(config)
      }
    });
    cy.getByDataTest('popular-searches-max-to-render').clear().type(maxItemsToRender.toString());
  }
);

// Scenario 1
Then('at most {int} popular searched are displayed', (maxItemsToRender: number) => {
  cy.getByDataTest('popular-search')
    .should('have.length.at.least', 1)
    .and('have.length.at.most', maxItemsToRender);
});

// Scenario 2
When('popular search number {int} is clicked', (popularSearchItem: number) => {
  cy.getByDataTest('popular-search')
    .eq(popularSearchItem)
    .click()
    .invoke('text')
    .as('searchedQuery');
});

And(
  'the clicked popular search is removed from Popular Searches if hideSessionQueries = {boolean} is true',
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
