import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
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
  let semanticQueriesLength = 0;

  cy.wait('@interceptedSemanticQueries')
    .should(({ response }) => {
      semanticQueriesLength = response?.body.semanticQueries.length;
    })
    .then(() => {
      cy.getByDataTest('semantic-queries-query')
        .should('have.length.at.least', semanticQueriesLength)
        .should('be.visible')
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
