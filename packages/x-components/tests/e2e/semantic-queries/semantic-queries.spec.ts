import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { SemanticQuery } from '@empathyco/x-types';
import { InstallXOptions } from '../../../src/x-installer';

let semanticQueriesList: string[] = [];

Given('an application with a semantic queries threshold of {int}', (threshold: number) => {
  const config: InstallXOptions['xModules'] = {
    semanticQueries: {
      config: {
        threshold
      }
    }
  };

  cy.visit('/', {
    qs: {
      xModules: JSON.stringify(config)
    }
  });
});

Then('semantic queries are displayed', () => {
  semanticQueriesList = [];

  cy.wait('@interceptedSemanticQueries').then(({ response }) => {
    const semanticQueries = response?.body.semanticQueries as SemanticQuery[];

    semanticQueries.forEach(semanticQuery => {
      cy.getByDataTest('semantic-queries-query')
        .get(`[data-query="${semanticQuery.query}"]`)
        .scrollIntoView()
        .should('be.visible');
      semanticQueriesList.push(semanticQuery.query);
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
