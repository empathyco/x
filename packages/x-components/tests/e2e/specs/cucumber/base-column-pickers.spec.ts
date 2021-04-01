import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('no special config for base-column-picker view', () => {
  cy.visit('/test/base-column-picker');
});

When('{int} columns are selected from the column picker list', (numberOfColumnsList: number) => {
  cy.getByDataTest('column-picker-list').children().contains(numberOfColumnsList).click();
});

When(
  '{int} columns are selected from the column picker dropdown',
  (numberOfColumnsDropDown: number) => {
    cy.getByDataTest('dropdown-toggle')
      .click()
      .siblings('ul')
      .children('li')
      .contains(numberOfColumnsDropDown)
      .click();
  }
);

Then('recommendations and results are displayed in {int} columns', (numberOfColumns: number) => {
  cy.getByDataTest('grid')
    .should('have.length', 2)
    .each(grid => expect(grid).to.have.class(`x-base-grid--cols-${numberOfColumns.toString()}`));
});
