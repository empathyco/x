import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { TopRecommendationsRequest } from '@empathyco/x-adapter';
import { recommendationsStub } from './stubs/recommendations.stub';

Given('suggestions API should respond with mocked suggestions', () => {
  cy.intercept('https://api.empathy.co/getTopRecommendations', req => {
    req.reply(recommendationsStub);
  }).as('interceptedRecommendations');
});

And('following config: max items to store is {int}', (maxItemsToRequest: number) => {
  const config = {
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
