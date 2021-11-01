import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('no special config for layout view', () => {
  cy.visit('/?useMockedAdapter=true');
});

Then(
  'clicked filter number {int} is shown in the selected filters list is {boolean}',
  function (this: any, simpleFilter: number, isShown: boolean) {
    cy.getByDataTest('selected-filters-list')
      .getByDataTest('selected-filters-list-item')
      .getByDataTest('filter')
      .invoke('text')
      .then(filterName => {
        if (isShown) {
          expect(filterName).to.eq(this['clickedFilter' + simpleFilter.toString()]);
        } else {
          expect(filterName).to.not.contain(this['clickedFilter' + simpleFilter.toString()]);
        }
      });
  }
);

// Scenario 2
When(
  'child hierarchical filter {int} from parent filter {int} in {string} is clicked',
  (childFilter: number, parentFilter: number, facetName: string) => {
    cy.getByDataTest(`${facetName}-filter`)
      .eq(parentFilter)
      .getByDataTest('children-filters')
      .getByDataTest('filter')
      .eq(childFilter)
      .click()
      .invoke('text')
      .as(`clickedChildFilter${childFilter}`);
  }
);

Then(
  'clicked child filter {int} is selected in facet {string} is {boolean}',
  function (this: any, simpleFilter: number, facetName: string, isSelected: boolean) {
    cy.getByDataTest(`${facetName}-filter`)
      .contains(this['clickedChildFilter' + simpleFilter.toString()])
      .then(filter => {
        if (isSelected) {
          expect(filter).to.have.class('x-filter--is-selected');
        } else {
          expect(filter).not.to.have.class('x-filter--is-selected');
        }
      });
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
