import { Then, When } from 'cypress-cucumber-preprocessor/steps';

When(
  'sort option {string} is selected from the sort {string}',
  (sortOption: string, sortMenu: string) => {
    if (sortMenu === 'dropdown') {
      cy.getByDataTest(`sort-${sortMenu}-toggle`).click();
    }
    cy.getByDataTest(`sort-${sortMenu}`).children().contains(sortOption).click();
  }
);

Then('search request contains the selected sort {string}', (sortOption: string) => {
  cy.wait('@interceptedResults')
    .its('request.body')
    .then(JSON.parse)
    .should('have.property', 'sort', sortOption === 'default' ? '' : sortOption);
});
