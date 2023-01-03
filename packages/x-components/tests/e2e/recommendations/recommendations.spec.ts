import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { InstallXOptions } from '../../../src/x-installer/x-installer/types';

// Scenario 1
Given('following config: max items to store is {int}', (maxItemsToRequest: number) => {
  const config: InstallXOptions['xModules'] = {
    recommendations: {
      config: {
        maxItemsToRequest
      }
    }
  };

  cy.visit('/', {
    qs: {
      xModules: JSON.stringify(config)
    }
  });
});

Then(
  'number of displayed recommendations are equal or less than {int}',
  (maxItemsToRequest: number) => {
    cy.getByDataTest('recommendation-item')
      .should('be.visible')
      .should('have.length.at.least', 1)
      .and('have.length.at.most', maxItemsToRequest);
  }
);

Then('each recommendation has an associated hyperlink, image and text', () => {
  cy.getByDataTest('recommendation-item').getByDataTest('result-link').should('have.attr', 'href');
  cy.getByDataTest('recommendation-item')
    .getByDataTest('result-link')
    .getByDataTest('result-picture')
    .should('exist');
  cy.getByDataTest('recommendation-item')
    .getByDataTest('result-link')
    .getByDataTest('result-title')
    .should('exist');
});
