import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

// Scenario 1
When('clear filters button is clicked', () => {
  cy.getByDataTest('clear-filters').click();
});

And(
  'filters {string} are shown in the selected filters list',
  function (this: any, clickedFiltersIndex: string) {
    const clickedFiltersIndexList = clickedFiltersIndex.split(', ');
    clickedFiltersIndexList.forEach(index => {
      cy.getByDataTest('selected-filters-list').should('contain', this[`clickedFilter${index}`]);
    });
  }
);

Then('no filters are selected', () => {
  ['age_facet-filter', 'price_facet-filter', 'hierarchical_category-filter'].forEach(facetName => {
    cy.getByDataTest(facetName).should('not.have.class', 'x-filter--is-selected');
  });
});

// Scenario 3
When('filter number {int} is clicked in selected filters list', (selectedFilterItem: number) => {
  cy.getByDataTest('selected-filters-list-item')
    .getByDataTest('filter')
    .eq(selectedFilterItem)
    .click()
    .invoke('text')
    .as('removedFilter');
});

Then('filter is removed from selected filters list', function (this: { removedFilter: string }) {
  cy.getByDataTest('selected-filters-list-item').should('not.contain', this.removedFilter);
});
