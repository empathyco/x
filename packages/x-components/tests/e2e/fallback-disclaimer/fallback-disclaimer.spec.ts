import { Then } from '@badeball/cypress-cucumber-preprocessor';

Then('fallback disclaimer is displayed', () => {
  cy.getByDataTest('fallback-disclaimer').should('exist');
});
