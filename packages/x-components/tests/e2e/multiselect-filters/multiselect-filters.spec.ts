import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

Then('search request contains selected filter', function () {
  cy.wait('@requestWithFilter').its('request.body').should('include', this.clickedFilter);
});

When(
  'selected filter number {int} in facet {string} list is clicked',
  (selectedFilter: number, facetName: string) => {
    cy.getByDataTest(`${facetName}-filter`)
      .should('have.class', 'x-filter--is-selected')
      .eq(selectedFilter)
      .click();
  }
);
