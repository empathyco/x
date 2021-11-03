import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

When('filter {string} is clicked in facet {string}', (filter: string, facetName: string) => {
  cy.getByDataTest(`${facetName}-filter`).contains(filter).click();
});

And('waiting for search request intercept', () => {
  cy.intercept('https://api.empathy.co/search').as('requestWithFilter');
});

Then('filter {string} is shown in the selected filters list', (filter: string) => {
  cy.getByDataTest('selected-filters-list')
    .getByDataTest('filter')
    .contains(filter)
    .should('exist');
});

And('search request contains {string} filter', (filter: string) => {
  cy.wait('@requestWithFilter').its('request.body').should('include', filter);
});

And('clear-filters button should have {int} filters selected', (selectedFiltersLength: number) => {
  cy.getByDataTest('clear-filters').should('contain', selectedFiltersLength);
});
