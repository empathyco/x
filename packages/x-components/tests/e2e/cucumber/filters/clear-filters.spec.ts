import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

// Scenario 1
When('clear filters button is clicked', () => {
  cy.getByDataTest('clear-filters').click();
});

And(
  'filters {string} are shown in the selected filters list',
  function (this: any, clickedFiltersIndex: string) {
    const clickedFiltersIndexList = clickedFiltersIndex.split(', ');
    for (let i = 0; i < clickedFiltersIndexList.length; i++) {
      cy.getByDataTest('selected-filters-list').should(
        'contain',
        this[`clickedFilter${clickedFiltersIndexList[i]}`]
      );
    }
  }
);

Then('no filters are selected', () => {
  cy.getByDataTest('age_facet-filter').should('not.have.class', 'x-filter--is-selected');
  cy.getByDataTest('price_facet-filter').should('not.have.class', 'x-filter--is-selected');
  cy.getByDataTest('hierarchical_category-filter').should(
    'not.have.class',
    'x-filter--is-selected'
  );
});

// Scenario 3
When('filter number {int} is clicked in selected filters list', (selectedFilterItem: number) => {
  cy.getByDataTest('selected-filters-list-item')
    .eq(selectedFilterItem)
    .click()
    .invoke('text')
    .as('removedFilter');
});

Then('filter is removed from selected filters list', function (this: { removedFilter: string }) {
  cy.getByDataTest('selected-filters-list-item').should('not.contain', this.removedFilter);
});
