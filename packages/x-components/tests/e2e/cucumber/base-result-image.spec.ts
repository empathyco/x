import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('no special config for base-result-image view', () => {
  cy.visit('/test/base-result-image');
});

And('{int} picture placeholders with no final content loaded yet', (placeholdersLength: number) => {
  cy.getByDataTest('result-picture__placeholder').should('have.length', placeholdersLength);
  cy.getByDataTest('result-picture__image').should('not.exist');
  cy.getByDataTest('result-picture__fallback').should('not.exist');
});

When('scroll down is performed', () => {
  cy.scrollTo('bottom');
});

Then(
  'placeholder {int} is replaced for {string}',
  (placeholderIndexItem: number, loadedContent: string) => {
    cy.get('.x-result-picture')
      .eq(placeholderIndexItem)
      .should('not.contain', 'placeholder')
      .getByDataTest(loadedContent)
      .should('exist');
  }
);
