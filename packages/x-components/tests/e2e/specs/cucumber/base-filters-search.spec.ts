import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

Given('no special config for base-filters-search view', () => {
  cy.visit('/test/base-filters-search');
});

Then('brand filters for the searched query are displayed', () => {
  cy.getByDataTest('brand-filter').should('have.length.at.least', 1);
});

When('{string} is typed in the filters search input', (siftedQuery: string) => {
  cy.getByDataTest('filters-search-input').type(siftedQuery);
});

Then('brand filters are refined with sifted search, {string}', (siftedQuery: string) => {
  cy.getByDataTest('brand-filter').should(brandFilterItem => {
    brandFilterItem.each((_, e) => {
      expect(e.innerText.toLowerCase()).to.contain(siftedQuery);
    });
  });
});
