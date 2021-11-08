import { And, Then } from 'cypress-cucumber-preprocessor/steps';

And('waiting for search request intercept', () => {
  cy.intercept('https://api.empathy.co/search').as('requestWithFilter');
});

Then(
  'selected filter is shown in the selected filters list',
  function (this: { clickedFilter: string }) {
    cy.getByDataTest('selected-filters-list')
      .getByDataTest('selected-filters-list-item')
      .getByDataTest('filter')
      .invoke('text')
      .then(filterName => {
        expect(filterName).to.eq(this.clickedFilter);
      });
  }
);

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

And('clear-filters button displays the number of selected filters', () => {
  cy.get('.x-filter--is-selected').then($selectedFilters => {
    const selectedFiltersNumber = $selectedFilters.length;
    cy.getByDataTest('clear-filters').should('contain', selectedFiltersNumber.toString());
  });
});
