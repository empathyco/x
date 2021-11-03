import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When('{int} columns are selected from the column picker list', (numberOfColumns: number) => {
  cy.getByDataTest('column-picker-list')
    .children(`.x-column-picker-list__item--${numberOfColumns}-cols`)
    .click();
});

Then('results are displayed in {int} columns', (numberOfColumns: number) => {
  cy.getByDataTest('grid').should('have.class', `x-grid--cols-${numberOfColumns || 'auto'}`);
});
