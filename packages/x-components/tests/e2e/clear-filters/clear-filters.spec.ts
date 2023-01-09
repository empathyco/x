import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Scenario 1
When('clear filters button is clicked', () => {
  cy.getByDataTest('clear-filters').click();
});

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

Then('filter is removed from selected filters list', function () {
  cy.getByDataTest('selected-filters-list-item').should('not.contain', this.removedFilter);
});
