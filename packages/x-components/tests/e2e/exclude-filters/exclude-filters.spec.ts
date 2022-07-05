import { And, Then } from 'cypress-cucumber-preprocessor/steps';

Then('only filters with totalResults undefined or greater than 0 are shown in facet', () => {
  cy.getByDataTest('brand_facet-filter-total-results')
    .should('exist')
    .should($totalResultsElements => {
      $totalResultsElements.each((_, totalResults) => {
        expect(totalResults.innerText.trim()).to.not.equal('0');
      });
    });
});

And('{string} total filters are more than displayed filters', function (facetName: string) {
  cy.getByDataTest('facets-facet')
    .contains(facetName)
    .getByDataTest('total-filters')
    .invoke('text')
    .then(totalFilters => {
      cy.getByDataTest(`${facetName}-filter`)
        .should('exist')
        .should('have.length.lt', parseInt(totalFilters));
    });
});
