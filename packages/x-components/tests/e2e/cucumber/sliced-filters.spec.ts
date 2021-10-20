import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

let totalFilters: number, slicedFilters: number, hiddenFilters: number;

Given('following config: max of sliced filters {int}', (slicedFiltersMax: number) => {
  cy.visit('/?useMockedAdapter=true');
  cy.getByDataTest('sliced-filters-max').clear().type(slicedFiltersMax.toString());
});

And('filters are displayed', () => {
  cy.getByDataTest('base-filters').should('have.length', 5);
});

And('number of sliced filters in facet {string} are stored', (facetName: string) => {
  cy.getByDataTest(facetName)
    .parent('button')
    .siblings('div')
    .getByDataTest('base-filters-item')
    .then($filters => {
      slicedFilters = $filters.length;
    });
});

And('number of sliced filters match {int}', (slicedFiltersMax: number) => {
  expect(slicedFilters).to.eq(slicedFiltersMax);
});

And('number of hidden filters in facet {string} are stored', (facetName: string) => {
  cy.getByDataTest(facetName)
    .parent('button')
    .siblings('div')
    .getByDataTest('sliced-filters-show-more-button')
    .then($button => {
      hiddenFilters = Number($button.text().match(/[0-9]+/g));
    });
});

Then('total filters per facet are calculated', () => {
  totalFilters = slicedFilters + hiddenFilters;
  cy.log(slicedFilters.toString());
  cy.log(hiddenFilters.toString());
});

When('clicking in show more button {string}', (facetName: string) => {
  cy.getByDataTest(facetName)
    .parent('button')
    .siblings('div')
    .getByDataTest('sliced-filters-show-more-button')
    .click();
});

Then('total filters match displayed + hidden filters', () => {
  expect(totalFilters).to.eq(slicedFilters);
});

// Scenario 2
And('number of sliced filters are at most {int}', (slicedFiltersMax: number) => {
  expect(slicedFilters).to.be.lte(slicedFiltersMax);
});

And('no show more / show less buttons are displayed in {string}', (facetName: string) => {
  cy.getByDataTest(facetName)
    .parent('button')
    .siblings('div')
    .getByDataTest('sliced-filters-show-more-button')
    .should('not.exist')
    .getByDataTest('sliced-filters-show-less-button')
    .should('not.exist');
});
