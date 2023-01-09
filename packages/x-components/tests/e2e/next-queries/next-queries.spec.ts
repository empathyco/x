import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { InstallXOptions } from '../../../src/x-installer/x-installer/types';

// Background

Given(
  'following config: hide session queries {boolean}, requested items {int}, loadOnInit {boolean}',
  (hideSessionQueries: boolean, maxItemsToRequest: number, loadOnInit: boolean) => {
    const config: InstallXOptions['xModules'] = {
      nextQueries: {
        config: {
          hideSessionQueries,
          maxItemsToRequest,
          loadOnInit
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
  }
);

// Scenario 1
Then('at most {int} next queries are displayed', (maxItemsToRequest: number) => {
  cy.getByDataTest('next-query')
    .should('have.length.at.least', 1)
    .and('have.length.at.most', maxItemsToRequest);
});

When('next query number {int} is clicked', (nextQueryItem: number) => {
  cy.getByDataTest('next-query').eq(nextQueryItem).click().invoke('text').as('searchedQuery');
});

Then('next queries do not contain the searched query', function () {
  cy.checkNextQueries(this.searchedQuery, false);
});

// Scenario 2
Then(
  'next queries do not contain the history query is {boolean}',
  function (hideSessionQueries: boolean) {
    if (hideSessionQueries) {
      cy.getByDataTest('next-query').should(nextQueries => {
        nextQueries.each((_, e) => {
          expect(e).to.not.have.text(this.historicalQuery);
        });
      });
    } else {
      cy.getByDataTest('next-query').first().should('have.text', this.historicalQuery);
    }
  }
);

Then('next queries contain the history query', function () {
  cy.getByDataTest('next-query').first().should('have.text', this.historicalQuery);
});

// Scenario 3

Then('next queries are still displayed', function () {
  cy.getByDataTest('next-query').should('have.text', this.nextQueries);
});

Then('next queries are still displayed is {boolean}', function (loadOnInit: boolean) {
  if (loadOnInit) {
    cy.getByDataTest('next-query').should('have.text', this.nextQueries);
  } else {
    cy.getByDataTest('next-query').should('not.exist');
  }
});
