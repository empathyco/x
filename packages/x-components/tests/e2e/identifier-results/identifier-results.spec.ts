import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import { XPluginOptions } from '../../../src/plugins/x-plugin.types';

Given(
  'following config: identifier detection Regexp {string}',
  (identifierDetectionRegexp: string) => {
    const config: XPluginOptions['xModules'] = {
      identifierResults: {
        config: {
          identifierDetectionRegexp
        }
      }
    };

    cy.visit('/', {
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
