import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('no special config for base-filters-search view', () => {
  cy.visit('/?useMockedAdapter=true');
});

Then('filters for the searched query in {string} are displayed', (facetName: string) => {
  cy.getByDataTest(facetName)
    .parent('button')
    .siblings('div')
    .getByDataTest('base-filters-item')
    .should('have.length.at.least', 1);
});

And('searchable {string} filters are stored', (facetName: string) => {
  cy.getByDataTest(facetName)
    .parent('button')
    .siblings('div')
    .getByDataTest('base-filters-item')
    .invoke('text')
    .as('searchableFilters');
});

When('{string} is typed in the filters search input', (siftedQuery: string) => {
  cy.getByDataTest('filters-search-input').type(siftedQuery);
});

Then(
  'filters in {string} are refined with sifted search, {string}',
  (facetName: string, siftedQuery: string) => {
    cy.getByDataTest(facetName)
      .parent('button')
      .siblings('div')
      .getByDataTest('base-filters-item')
      .should(filterItem => {
        filterItem.each((_, e) => {
          expect(e.innerText.toLowerCase()).to.contain(siftedQuery);
        });
      })
      .invoke('text')
      .as('refinedFilters');
  }
);

And(
  'searchable filters in {string} contain refined filters',
  function (this: { searchableFilters: string[] }, facetName) {
    cy.getByDataTest(facetName)
      .parent('button')
      .siblings('div')
      .getByDataTest('base-filters-item')
      .should(refinedFilter => {
        refinedFilter.each((_, e) => {
          expect(this.searchableFilters).to.contain(e.innerText);
        });
      });
  }
);
