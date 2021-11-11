import { Then, When } from 'cypress-cucumber-preprocessor/steps';

Then(
  'filter number {int} is shown in the selected filters list is {boolean}',
  function (this: any, simpleFilterIndex: number, isShown: boolean) {
    cy.getByDataTest('selected-filters-list')
      .getByDataTest('selected-filters-list-item')
      .getByDataTest('filter')
      .invoke('text')
      .then(filterName => {
        isShown
          ? expect(filterName).to.eq(this[`clickedFilter${simpleFilterIndex}`])
          : expect(filterName).to.not.contain(this[`clickedFilter${simpleFilterIndex}`]);
      });
  }
);

// Scenario 2
When(
  'child hierarchical filter {int} from parent filter {int} in {string} is clicked',
  (childFilterIndex: number, parentFilterIndex: number, facetName: string) => {
    cy.getByDataTest(`${facetName}-filter`)
      .eq(parentFilterIndex)
      .getByDataTest('children-filters')
      .getByDataTest('filter')
      .eq(childFilterIndex)
      .click()
      .invoke('text')
      .as(`clickedChildFilter${childFilterIndex}`);
  }
);

Then(
  'selection status of child filter number {int} in facet {string} is {boolean}',
  function (this: any, simpleFilterIndex: number, facetName: string, isSelected: boolean) {
    cy.getByDataTest(`${facetName}-filter`)
      .contains(this[`clickedChildFilter${simpleFilterIndex}`])
      .should(`${isSelected ? '' : 'not.'}to.have.class`, 'x-filter--is-selected');
  }
);

// Scenario 3
When('clear filters button is clicked', () => {
  cy.getByDataTest('clear-filters').click();
});

Then('no filters are selected', () => {
  cy.getByDataTest('brand_facet-filter').should('not.have.class', 'x-filter--is-selected');
  cy.getByDataTest('age_facet-filter').should('not.have.class', 'x-filter--is-selected');
  cy.getByDataTest('price_facet-filter').should('not.have.class', 'x-filter--is-selected');
});
