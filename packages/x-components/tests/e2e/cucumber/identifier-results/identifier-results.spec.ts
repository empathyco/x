import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { XPluginOptions } from '../../../../src/plugins/x-plugin.types';

Given(
  'following config: identifier detection Regexp {string}',
  (identifierDetectionRegexp: string) => {
    const config = {
      identifierResults: {
        config: {
          identifierDetectionRegexp
        }
      }
    } as XPluginOptions['xModules'];

    cy.visit('/?useMockedAdapter=true', {
      qs: {
        xModules: JSON.stringify(config)
      }
    });
  }
);

Then('identifier results are displayed', () => {
  cy.getByDataTest('identifier-results-item')
    .should('be.visible')
    .should('have.length.at.least', 1);
});

Then('no identifier results are displayed', () => {
  cy.getByDataTest('identifier-results-item').should('not.exist');
});
