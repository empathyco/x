import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { InstallXOptions } from '../../../src/x-installer';
import { XModuleOptions } from '../../../src/index';

let semanticQueriesList: string[] = [];
let semanticQueriesConfig: XModuleOptions<'semanticQueries'>['config'] = {};

Then('application is initialized with the custom semantic queries config', () => {
  const config: InstallXOptions['xModules'] = {
    semanticQueries: {
      config: semanticQueriesConfig
    }
  };

  cy.visit('/', {
    qs: {
      xModules: JSON.stringify(config)
    }
  });
});

Given('a clean semantic queries config', () => {
  semanticQueriesConfig = {};
});

Given('a semantic queries threshold config of {int}', (threshold: number) => {
  semanticQueriesConfig!.threshold = threshold;
});

Given('a semantic queries max items to request config of {int}', (maxItemsToRequest: number) => {
  semanticQueriesConfig!.maxItemsToRequest = maxItemsToRequest;
});

Then('semantic queries are displayed', () => {
  semanticQueriesList = [];
  let semanticQueriesLength = 0;

  cy.wait('@interceptedSemanticQueries')
    .should(({ response }) => {
      semanticQueriesLength = response?.body.semanticQueries.length;
    })
    .then(() => {
      cy.getByDataTest('semantic-queries-query')
        .should('be.visible')
        .should('have.length.at.least', semanticQueriesLength)
        .each($query => {
          semanticQueriesList.push($query.text());
        });
    });
});

Then('semantic queries results are displayed', () => {
  semanticQueriesList.forEach(query => {
    cy.getByDataTest('semantic-query-preview')
      .get(`[data-query="${query}"]`)
      .scrollIntoView()
      .getByDataTest('semantic-query-result')
      .should('be.visible')
      .should('have.length.at.least', 1);
  });
});

Then('semantic queries request is not fired after {int} ms', (timeToWait: number) => {
  cy.wait(timeToWait);
  cy.get('@interceptedSemanticQueries').should('be.null');
});

Then('semantic queries are not displayed', () => {
  cy.getByDataTest('semantic-query-preview').should('not.exist');
});

Then('{int} semantic queries are requested', itemsToRequest => {
  cy.get('@interceptedSemanticQueries')
    .its('request.body')
    .should((body: string) => {
      expect(JSON.parse(body).extraParams).to.have.property('k', itemsToRequest);
    });
});
