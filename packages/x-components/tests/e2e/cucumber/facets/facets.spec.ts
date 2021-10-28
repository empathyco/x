import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

/**
 * Click on a filter from a certain facet.
 *
 * @param facetName - Name of the facet which the filter to be clicked belongs to.
 * @param nthFilter - Position of the filter to be clicked.
 */
function clickFacetNthFilter(facetName: string, nthFilter: number): void {
  cy.getByDataTest(`${facetName}_filter`)
    .eq(nthFilter)
    .click()
    .invoke('text')
    .as(`clickedFilter${nthFilter}`);
}

Given('no special config for layout view', () => {
  cy.visit('/?useMockedAdapter=true');
});

When(
  'filter number {int} is clicked in facet {string}',
  (filterNumber: number, facetName: string) => {
    clickFacetNthFilter(facetName, filterNumber);
  }
);

Then(
  'clicked filter number {int} is shown in the selected filters list',
  function (this: any, simpleFilter: number) {
    cy.getByDataTest('selected-filters-list')
      .getByDataTest('selected-filters-list-item')
      .getByDataTest('filter')
      .invoke('text')
      .then(filterName => {
        expect(filterName).to.eq(this['clickedFilter' + simpleFilter.toString()]);
      });
  }
);

Then(
  'clicked filter number {int} is not shown in the selected filters list',
  function (this: any, simpleFilter: number) {
    cy.getByDataTest('selected-filters-list')
      .getByDataTest('selected-filters-list-item')
      .getByDataTest('filter')
      .invoke('text')
      .then(filterName => {
        expect(filterName).to.not.contain(this['clickedFilter' + simpleFilter.toString()]);
      });
  }
);

And(
  'search request contains selected filter number {int}',
  function (this: any, simpleFilter: number) {
    cy.wait('@requestWithFilter')
      .its('request.body')
      .should('include', this['clickedFilter' + simpleFilter.toString()]);
  }
);

And(
  'search request does not contain selected filter number {int}',
  function (this: any, simpleFilter: number) {
    cy.wait('@requestWithFilter')
      .its('request.body')
      .should('not.include', this['clickedFilter' + simpleFilter.toString()]);
  }
);

Then(
  'clicked filter {int} is selected in facet {string}',
  function (this: any, simpleFilter: number, facetName: string) {
    cy.getByDataTest(`${facetName}_filter`)
      .contains(this['clickedFilter' + simpleFilter.toString()])
      .should('have.class', 'x-filter--is-selected');
  }
);

Then(
  'clicked filter {int} is not selected in facet {string}',
  function (this: any, simpleFilter: number, facetName: string) {
    cy.getByDataTest(`${facetName}_filter`)
      .contains(this['clickedFilter' + simpleFilter.toString()])
      .should('not.have.class', 'x-filter--is-selected');
  }
);

// Scenario 2
And(
  'hierarchical filter number {int} is clicked in facet {string}',
  (hierarchicalFilter: number, facetName: string) => {
    cy.getByDataTest(`${facetName}_filter`)
      .eq(hierarchicalFilter)
      .getByDataTest('filter')
      .eq(0)
      .click()
      .invoke('text')
      .as(`clickedFilter${hierarchicalFilter}`);
  }
);

When(
  'child hierarchical filter {int} from parent filter {int} in {string} is clicked',
  (childFilter: number, parentFilter: number, facetName: string) => {
    cy.getByDataTest(`${facetName}_filter`)
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
  'clicked child filter {int} is selected in facet {string}',
  function (this: any, simpleFilter: number, facetName: string) {
    cy.getByDataTest(`${facetName}_filter`)
      .contains(this['clickedChildFilter' + simpleFilter.toString()])
      .should('have.class', 'x-filter--is-selected');
  }
);

Then(
  'clicked child filter {int} is not selected in facet {string}',
  function (this: any, simpleFilter: number, facetName: string) {
    cy.getByDataTest(`${facetName}_filter`)
      .contains(this['clickedChildFilter' + simpleFilter.toString()])
      .should('not.have.class', 'x-filter--is-selected');
  }
);

// Scenario 3
When('clear filters button is clicked', () => {
  cy.getByDataTest('clear-filters').click();
});

Then('no filters are selected', () => {
  cy.getByDataTest('brand_facet_filter').should('not.have.class', 'x-filter--is-selected');
  cy.getByDataTest('age_facet_filter').should('not.have.class', 'x-filter--is-selected');
  cy.getByDataTest('price_facet_filter').should('not.have.class', 'x-filter--is-selected');
});
