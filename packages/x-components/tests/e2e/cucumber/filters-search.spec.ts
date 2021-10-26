import { And, Then, When } from 'cypress-cucumber-preprocessor/steps';

Then('facet has filters', () => {
  cy.getByDataTest('brand-filter').should('have.length.at.least', 1);
});

And('searchable filters are stored', () => {
  cy.getByDataTest('brand-filter').invoke('text').as('searchableFilters');
});

When('{string} is typed in the filters search input', (searchFiltersQuery: string) => {
  cy.getByDataTest('filters-search-input').type(searchFiltersQuery);
});

Then('filters in facet are refined with search, {string}', (searchFiltersQuery: string) => {
  cy.getByDataTest('brand-filter')
    .should(filterElements => {
      filterElements.each((_, e) => {
        expect(e.innerText.toLowerCase()).to.contain(searchFiltersQuery);
      });
    })
    .invoke('text')
    .as('refinedFilters');
});

And(
  'searchable filters in facet contain refined filters',
  function (this: { searchableFilters: string[] }) {
    cy.getByDataTest('brand-filter').should(refinedFilter => {
      refinedFilter.each((_, e) => {
        expect(this.searchableFilters).to.contain(e.innerText);
      });
    });
  }
);
