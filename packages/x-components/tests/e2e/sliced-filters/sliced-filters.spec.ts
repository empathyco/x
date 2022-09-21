import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

let totalFilters: number, hiddenFilters: number;

Given('following config: max of sliced filters {int}', (slicedFiltersMax: number) => {
  cy.visit('/');
  cy.getByDataTest('sliced-filters-max').clear().type(slicedFiltersMax.toString());
});

When('filters are displayed', () => {
  cy.getByDataTest('base-filters').should('have.length', 5);
});

Then('number of sliced filters in facet {string} are stored', (facetName: string) => {
  cy.getByDataTest(`${facetName}-filter`).as('slicedFilters');
});

Then('number of sliced filters match {int}', function (slicedFiltersMax: number) {
  expect(this.slicedFilters.length).to.eq(slicedFiltersMax);
});

When('number of hidden filters in facet {string} are stored', (facetName: string) => {
  cy.getByDataTest(`${facetName}-sliced-filters`)
    .getByDataTest('show-more-amount')
    .then($button => {
      hiddenFilters = Number($button.text());
    });
});

Then('total filters per facet are calculated', function () {
  totalFilters = (this.slicedFilters as string[]).length + hiddenFilters;
});

When('clicking in show more button {string}', (facetName: string) => {
  cy.getByDataTest(`${facetName}-sliced-filters`)
    .getByDataTest('sliced-filters-show-more-button')
    .click();
});

Then('total filters match displayed + hidden filters', function () {
  expect(totalFilters).to.eq(this.slicedFilters.length);
});

// Scenario 2
Then('number of sliced filters are at most {int}', function (slicedFiltersMax: number) {
  expect(this.slicedFilters.length).to.be.lte(slicedFiltersMax);
});

Then('no show more or show less buttons are displayed in {string}', (facetName: string) => {
  cy.getByDataTest(`${facetName}-sliced-filters`)
    .getByDataTest('sliced-filters-show-more-button')
    .should('not.exist')
    .getByDataTest('sliced-filters-show-less-button')
    .should('not.exist');
});

// Scenario 3
When('clicking in show less button {string}', (facetName: string) => {
  cy.getByDataTest(`${facetName}-sliced-filters`)
    .getByDataTest('sliced-filters-show-less-button')
    .click();
});

Then(
  'number of selected filters in facet {string} are {int}',
  (facetName: string, selectedFiltersNumber: number) => {
    cy.getByDataTest(`${facetName}-selected-filters`)
      .invoke('text')
      .should(text => {
        expect(text).to.contain(selectedFiltersNumber);
      });
  }
);
