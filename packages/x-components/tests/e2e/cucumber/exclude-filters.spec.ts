import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('no special config for exclude-filters view', () => {
  cy.visit('/test/exclude-filters');
});

Then('filters with totalResults undefined or greater than 0 are shown', () => {
  cy.getByDataTest('filter-total-results')
    .should('exist')
    .should($totalResultsItem => {
      $totalResultsItem.each((_, e) => {
        expect(e.innerText).to.not.equal('0');
      });
    });
});

And(
  'price total filters are more than displayed filters',
  function (this: { priceTotalFilters: string }) {
    cy.getByDataTest('price-total-filters')
      .invoke('text')
      .as('priceTotalFilters')
      .then(() => {
        cy.getByDataTest('price-filter').should('have.length.lt', parseInt(this.priceTotalFilters));
      });
  }
);
