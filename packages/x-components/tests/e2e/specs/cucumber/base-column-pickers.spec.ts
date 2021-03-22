import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('no special config for base-column-picker view', () => {
  cy.visit('/test/base-column-picker');
});

When('{int} columns are selected from the column picker list', (numberOfColumnsList: number) => {
  cy.getByDataTest('column-picker-list')
    .children()
    .should('contain', numberOfColumnsList.toString())
    .click();
});

When(
  '{int} columns are selected from the column picker dropdown',
  (numberOfColumnsDropDown: number) => {
    cy.getByDataTest('column-picker-dropdown')
      .children()
      .should('contain', numberOfColumnsDropDown.toString())
      .click();
  }
);

Then('recommendations and results are displayed in {int} columns', (numberOfColumns: number) => {
  cy.getByDataTest('recommendations').should(
    'have.class',
    'x-base-grid--cols-' + numberOfColumns.toString()
  );
  cy.getByDataTest('results-list').should(
    'have.class',
    'x-base-grid--cols-' + numberOfColumns.toString()
  );
});
