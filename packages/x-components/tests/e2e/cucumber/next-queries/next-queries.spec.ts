import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { InstallXOptions } from '../../../../src/x-installer/x-installer/types';

let config: InstallXOptions['xModules'];

Given(
  'following config: hide session queries {boolean}, requested items {int}, loadOnInit {boolean}',
  (hideSessionQueries: boolean, maxItemsToRequest: number, loadOnInit: boolean) => {
    config = {
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
  }
);

And('next queries API should respond with {string}', (mockName: string) => {
  cy.intercept('https://api.empathy.co/getNextQueries', async req => {
    const module = await import('./stubs/next-queries.stub');
    req.reply(module[mockName as keyof typeof module]);
  }).as('interceptedNextQueries');

  cy.visit('/test/next-queries?useMockedAdapter=true', {
    qs: {
      xModules: JSON.stringify(config)
    }
  });
});

// Scenario 1
Then('at most {int} next queries are displayed', (maxItemsToRequest: number) => {
  cy.getByDataTest('next-query')
    .should('have.length.at.least', 1)
    .and('have.length.at.most', maxItemsToRequest);
});

// Scenario 2
When('next query number {int} is clicked', (nextQueryItem: number) => {
  cy.getByDataTest('next-query').eq(nextQueryItem).click().invoke('text').as('searchedQuery');
});

And('next queries do not contain the searched query', function (this: { searchedQuery: string }) {
  cy.checkNextQueries(this.searchedQuery, false);
});

And(
  'next queries do not contain the history query is {boolean}',
  function (this: { historicalQuery: string }, hideSessionQueries: boolean) {
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

And('next queries contain the history query', function (this: { historicalQuery: string }) {
  cy.getByDataTest('next-query').first().should('have.text', this.historicalQuery);
});

// Scenario 3
When('the page is reloaded', () => {
  cy.reload();
});

Then(
  'next queries are still displayed is {boolean}',
  function (this: { nextQueries: string }, loadOnInit: boolean) {
    if (loadOnInit) {
      cy.getByDataTest('next-query').should('have.text', this.nextQueries);
    } else {
      cy.getByDataTest('next-query').should('not.exist');
    }
  }
);

Then('next queries are still displayed', function (this: { nextQueries: string }) {
  cy.getByDataTest('next-query').should('have.text', this.nextQueries);
});
