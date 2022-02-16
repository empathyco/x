import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

let totalFilters: number, hiddenFilters: number;

Given('following config: max of sliced filters {int}', (slicedFiltersMax: number) => {
  cy.visit('/');
  cy.getByDataTest('sliced-filters-max').clear().type(slicedFiltersMax.toString());
});

And('filters are displayed', () => {
  cy.getByDataTest('base-filters').should('have.length', 5);
});

And('number of sliced filters in facet {string} are stored', (facetName: string) => {
  cy.getByDataTest(`${facetName}-filter`).as('slicedFilters');
});

And(
  'number of sliced filters match {int}',
  function (this: { slicedFilters: string[] }, slicedFiltersMax: number) {
    expect(this.slicedFilters.length).to.eq(slicedFiltersMax);
  }
);

And('number of hidden filters in facet {string} are stored', (facetName: string) => {
  cy.getByDataTest(`${facetName}-sliced-filters`)
    .getByDataTest('show-more-amount')
    .then($button => {
      hiddenFilters = Number($button.text());
    });
});

Then('total filters per facet are calculated', function (this: { slicedFilters: string[] }) {
  totalFilters = this.slicedFilters.length + hiddenFilters;
});

When('clicking in show more button {string}', (facetName: string) => {
  cy.getByDataTest(`${facetName}-sliced-filters`)
    .getByDataTest('sliced-filters-show-more-button')
    .click();
});

Then(
  'total filters match displayed + hidden filters',
  function (this: { slicedFilters: string[] }) {
    expect(totalFilters).to.eq(this.slicedFilters.length);
  }
);

// Scenario 2
And(
  'number of sliced filters are at most {int}',
  function (this: { slicedFilters: string[] }, slicedFiltersMax: number) {
    expect(this.slicedFilters.length).to.be.lte(slicedFiltersMax);
  }
);

And('no show more / show less buttons are displayed in {string}', (facetName: string) => {
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
