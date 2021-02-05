import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { InstallXOptions } from '../../../../src/x-installer/x-installer/types';

// Scenario 1
Given('following config: max items to store is {int}', (maxItemsToRequest: number) => {
  const config: InstallXOptions['xModules'] = {
    recommendations: {
      config: {
        maxItemsToRequest
      }
    }
  };
  cy.visit('/test/recommendations', {
    qs: {
      xModules: JSON.stringify(config)
    }
  });
});

Then(
  'number of displayed recommendations are equal or less than {int}',
  (maxItemsToRequest: number) => {
    cy.getByDataTest('recommendation-item')
      .should('exist')
      .and('have.length.at.most', maxItemsToRequest);
  }
);

And('each recommendation has an associated hyperlink containing image and text', () => {
  cy.getByDataTest('result-link').getByDataTest('recommendation-image').should('exist');
  cy.getByDataTest('result-link').getByDataTest('recommendation-text').should('exist');
});
