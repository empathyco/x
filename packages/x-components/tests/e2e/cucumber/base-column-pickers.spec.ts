import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When('{string} columns are selected from the column picker list', (numberOfColumns: string) => {
  cy.getByDataTest('column-picker-list')
    .children(`.x-column-picker-list__item--${numberOfColumns}-cols`)
    .click();
});

Then(
  '{string} are displayed in {string} columns',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  (resultType: string, numberOfColumns: string) => {
    if (numberOfColumns === '0') {
      numberOfColumns = 'auto';
    }
    cy.getByDataTest('grid').each(grid =>
      expect(grid).to.have.class(`x-base-grid--cols-${numberOfColumns.toString()}`)
    );
  }
);
