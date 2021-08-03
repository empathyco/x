import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { InstallXOptions } from '../../../../src/x-installer/x-installer/types';
import { TopRecommendationsRequest } from '../../../../../search-adapter/src/types/requests.types';

let config: InstallXOptions['xModules'];

Given('following config: max items to store is {int}', (maxItemsToRequest: number) => {
  config = {
    recommendations: {
      config: {
        maxItemsToRequest
      }
    }
  };
});

And('suggestions response being mock {string}', (mockName: string) => {
  cy.intercept('https://api.empathy.co/getTopRecommendations', async req => {
    const module = await import('./stubs/recommendations.stub');
    req.reply(module[mockName as keyof typeof module]);
  }).as('interceptedRecommendations');

  cy.visit('/test/recommendations?useMockedAdapter=true', {
    qs: {
      xModules: JSON.stringify(config)
    }
  });
});

// Scenario 1
Then('number of rows requested is {int}', (maxItemsToRequest: number) => {
  cy.wait('@interceptedRecommendations').then(({ request }) => {
    const { rows } = JSON.parse(request.body) as TopRecommendationsRequest;
    expect(rows).to.equal(maxItemsToRequest);
  });
});

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
