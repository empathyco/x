import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

const filterSearchConfigurations = [
  'after-slice-filter-search',
  'no-slice-filter-search',
  'before-slice-filter-search'
];

type SearchableFiltersObj = {
  searchableFilters0: string;
  searchableFilters1: string;
  searchableFilters2: string;
};

Given('no special config for base-filters-search view', () => {
  cy.visit('/test/base-filters-search');
});

Then('brand filters for the searched query are displayed', () => {
  cy.getByDataTest('brand-filter').should('have.length.at.least', 1);
});

And('searchable brand filters are stored', () => {
  cy.getByDataTest('before-slice-filter-search')
    .getByDataTest('sliced-filters-show-more-button')
    .click();
  filterSearchConfigurations.forEach((searchConfiguration, index) => {
    cy.getByDataTest(searchConfiguration)
      .getByDataTest('brand-filter')
      .invoke('text')
      .as(`searchableFilters${index}`);
  });
});

When('{string} is typed in the filters search input', (siftedQuery: string) => {
  filterSearchConfigurations.forEach(searchConfiguration => {
    cy.getByDataTest(searchConfiguration).getByDataTest('filters-search-input').type(siftedQuery);
  });
});

Then('brand filters are refined with sifted search, {string}', (siftedQuery: string) => {
  filterSearchConfigurations.forEach((searchConfiguration, index) => {
    cy.getByDataTest(searchConfiguration)
      .getByDataTest('brand-filter')
      .should(brandFilterItem => {
        brandFilterItem.each((_, e) => {
          expect(e.innerText.toLowerCase()).to.contain(siftedQuery);
        });
      })
      .invoke('text')
      .as(`refinedFilters${index}`);
  });
});

And(
  'searchable brand filters contain refined brand filters',
  function (this: SearchableFiltersObj) {
    filterSearchConfigurations.forEach((searchConfiguration, index) => {
      cy.getByDataTest(searchConfiguration)
        .getByDataTest('brand-filter')
        .each(brandFilterItem => {
          expect(this[`searchableFilters${index}` as keyof SearchableFiltersObj]).to.contain(
            brandFilterItem.text()
          );
        });
    });
  }
);
