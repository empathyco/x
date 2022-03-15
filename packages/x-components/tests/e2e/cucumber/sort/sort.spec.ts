import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('search request contains the selected sort {string}', (sortOption: string) => {
  cy.wait('@interceptedResults')
    .its('request.body')
    .then(JSON.parse)
    .should('have.property', 'sort', sortOption === 'default' ? '' : sortOption);
});
