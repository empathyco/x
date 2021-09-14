import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { InstallXOptions } from '../../../src/x-installer/x-installer/types';

// Scenario 1
Given('no special config for full empathize view', () => {
  cy.visit('/empathize?useMockedAdapter=true');
});

And('search-input is focused', () => {
  cy.focusSearchInput();
});

// Scenario 2
Then('history queries are displayed', () => {
  cy.getByDataTest('history-query').should('have.length.at.least', 1);
});

// Scenario 6
Given('following config: max recommendations to request {int}', (maxItemsToRequest: number) => {
  const config: InstallXOptions['xModules'] = {
    recommendations: {
      config: {
        maxItemsToRequest
      }
    }
  };
  cy.visit('/empathize', {
    qs: {
      xModules: JSON.stringify(config)
    }
  });
});

// Scenario 7
And('identifier results number {int} is clicked', (identifierResultItem: number) => {
  cy.getByDataTest('identifier-result')
    .should('have.length.gt', identifierResultItem)
    .eq(identifierResultItem)
    .click()
    .invoke('text')
    .as('clickedIdentifierResult');
});

Then(
  'user is redirected to the product page',
  function (this: { clickedIdentifierResult: string }) {
    cy.url().should('include', encodeURIComponent(this.clickedIdentifierResult));
  }
);

// Scenario 9
When('search-input is not focused', () => {
  cy.getByDataTest('search-input').should('not.be', 'focused');
});

Then('empathize is not displayed', () => {
  cy.getByDataTest('empathize').should('not.exist');
});

Then('empathize is displayed', () => {
  cy.getByDataTest('empathize').should('be.visible');
});
