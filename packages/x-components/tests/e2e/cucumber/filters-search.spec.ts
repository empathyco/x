import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

Then('facet {string} has filters', (facetName: string) => {
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

When('{string} is typed in the filters search input', (searchFiltersQuery: string) => {
  cy.getByDataTest('filters-search-input').type(searchFiltersQuery);
});

Then(
  'filters in {string} are refined with search, {string}',
  (facetName: string, searchFiltersQuery: string) => {
    cy.getByDataTest(facetName)
      .parent('button')
      .siblings('div')
      .getByDataTest('base-filters-item')
      .should(filterElements => {
        filterElements.each((_, e) => {
          expect(e.innerText.toLowerCase()).to.contain(searchFiltersQuery);
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
