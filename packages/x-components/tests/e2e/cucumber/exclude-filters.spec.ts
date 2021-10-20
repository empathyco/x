import { And, Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('no special config for exclude-filters view', () => {
  cy.visit('/?useMockedAdapter=true');
});

Then(
  'only filters with totalResults undefined or greater than 0 are shown in facet {string}',
  (facetName: string) => {
    cy.getByDataTest(facetName)
      .parent('button')
      .siblings('div')
      .getByDataTest('filter-total-results')
      .should('exist')
      .should($totalResultsItem => {
        $totalResultsItem.each((_, e) => {
          expect(e.innerText).to.not.equal(' 0');
        });
      });
  }
);

And(
  '{string} total filters are more than displayed filters',
  function (this: { totalFilters: string }, facetName) {
    cy.getByDataTest(facetName)
      .parent('button')
      .getByDataTest('total-filters')
      .invoke('text')
      .as('totalFilters')
      .then(() => {
        cy.getByDataTest(facetName)
          .parent('button')
          .siblings('div')
          .getByDataTest('base-filters-item')
          .should('have.length.lt', parseInt(this.totalFilters));
      });
  }
);
