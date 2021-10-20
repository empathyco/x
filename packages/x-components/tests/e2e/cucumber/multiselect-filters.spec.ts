import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

/**
 * Click on a filter from a certain facet.
 *
 * @param facetName - Name of the facet which the filter to be clicked belongs to.
 * @param nthFilter - Position of the filter to be clicked.
 */
function clickFacetNthFilter(facetName: string, nthFilter: number): void {
  cy.getByDataTest(facetName)
    .parent('button')
    .siblings('div')
    .getByDataTest('base-filters-item')
    .eq(nthFilter)
    .children('button')
    .click()
    .invoke('text')
    .as('clickedFilter');
}

Given('no special config for multiselect filters view', () => {
  cy.visit('/?useMockedAdapter=true');
});

When(
  'filter number {int} is selected in facet {string}',
  (filterNumber: number, facetName: string) => {
    clickFacetNthFilter(facetName, filterNumber);
  }
);

And('waiting for search request intercept', () => {
  cy.intercept('https://api.empathy.co/search').as('requestWithFilter');
});

Then(
  'selected filter is shown in the selected filters list',
  function (this: { clickedFilter: string }) {
    cy.getByDataTest('selected-filters-list')
      .getByDataTest('selected-filters-list-item')
      .children('button')
      .invoke('text')
      .then(filterName => {
        expect(filterName).to.eq(this.clickedFilter);
      });
  }
);

And('search request contains selected filter', function (this: { clickedFilter: string }) {
  cy.wait('@requestWithFilter').its('request.body').should('include', this.clickedFilter);
});

And('clear-filters button displays the number of selected filters', () => {
  cy.get('.x-filter--is-selected').then($selectedFilters => {
    const selectedFiltersNumber = $selectedFilters.length;
    cy.getByDataTest('clear-filters').should('contain', selectedFiltersNumber.toString());
  });
});
