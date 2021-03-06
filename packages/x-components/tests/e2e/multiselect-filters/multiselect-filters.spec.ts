import { And } from 'cypress-cucumber-preprocessor/steps';

And('search request contains selected filter', function (this: { clickedFilter: string }) {
  cy.wait('@requestWithFilter').its('request.body').should('include', this.clickedFilter);
});

And(
  'selected filter number {int} in facet {string} list is clicked',
  (selectedFilter: number, facetName: string) => {
    cy.getByDataTest(`${facetName}-filter`)
      .should('have.class', 'x-filter--is-selected')
      .eq(selectedFilter)
      .click();
  }
);
