import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('no special config for base-events-modal view', () => {
  cy.visit('/test/base-events-modal');
});

When('open modal button is clicked', () => {
  cy.getByDataTest('open-modal').click();
});

Then('modal is opened', () => {
  cy.getByDataTest('modal').should('exist');
});

When('clicking in a modal rendered component', () => {
  cy.getByDataTest('modal').children().getByDataTest('search-input').click();
});

When('clicking outside modal slot content', () => {
  cy.get('body').click('topRight');
});

Then('modal is closed', () => {
  cy.getByDataTest('modal').should('not.exist');
});

When('clicking close modal button', () => {
  cy.getByDataTest('close-modal').click();
});
