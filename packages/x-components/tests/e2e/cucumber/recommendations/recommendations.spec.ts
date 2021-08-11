import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { InstallXOptions } from '../../../../src/x-installer/x-installer/types';
import { createResultStub } from '../../../../src/__stubs__/results-stubs.factory';

Given('a recommendations API with a known response', () => {
  cy.intercept('https://api.empathy.co/getTopRecommendations', req => {
    req.reply({
      results: [
        createResultStub('Piscina 3 Anillos'),
        createResultStub('Among Us Figura Acción'),
        createResultStub('Barbie Sirenas Dreamtopia')
      ]
    });
  }).as('interceptedRecommendations');
});

Given('following config: max items to store is {int}', (maxItemsToRequest: number) => {
  const config: InstallXOptions['xModules'] = {
    recommendations: {
      config: {
        maxItemsToRequest
      }
    }
  };

  cy.visit('/test/recommendations?useMockedAdapter=true', {
    qs: {
      xModules: JSON.stringify(config)
    }
  });
});

// Scenario 1
Then(
  'number of displayed recommendations are equal or less than {int}',
  (maxItemsToRequest: number) => {
    cy.getByDataTest('recommendation-item')
      .should('have.length.at.least', 1)
      .and('have.length.at.most', maxItemsToRequest);
  }
);

And('each recommendation has an associated hyperlink containing image and text', () => {
  cy.getByDataTest('result-link').getByDataTest('recommendation-image').should('exist');
  cy.getByDataTest('result-link').getByDataTest('recommendation-text').should('exist');
});
