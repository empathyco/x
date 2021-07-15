import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

let totalFiltersByFacet: number[], slicedFiltersByFacet: number[], hiddenFiltersByFacet: number[];

Given('following config: max of sliced filters {int}', (slicedFiltersMax: number) => {
  cy.visit('/test/sliced-filters');
  cy.getByDataTest('sliced-filters-max').clear().type(slicedFiltersMax.toString());
});

And('filters are displayed', () => {
  cy.getByDataTest('base-filters').should('have.length', 5);
});

And('number of total filters per facet are stored', () => {
  cy.getByDataTest('base-toggle-panel')
    .getByDataTest('total-filters')
    .should($totals => {
      totalFiltersByFacet = $totals.toArray().map(totalElement => Number(totalElement.textContent));
    });
});

And('number of sliced filters per facet are stored', () => {
  cy.getByDataTest('base-toggle-panel')
    .getByDataTest('filters-show-more')
    .getByDataTest('sliced-filters')
    .should($sliced => {
      slicedFiltersByFacet = $sliced
        .toArray()
        .map(slicedElement => Number(slicedElement.textContent));
    });
});

Then('hidden filters per facet are calculated', () => {
  hiddenFiltersByFacet = totalFiltersByFacet
    .map((number, index) => number - slicedFiltersByFacet[index])
    .filter(hiddenFilters => hiddenFilters > 0);
});

Then('total filters - hidden filters per facet is displayed in show more button', () => {
  hiddenFiltersByFacet.forEach((result, index) => {
    cy.getByDataTest('sliced-filters-show-more-button').eq(index).should('contain', `${result}`);
  });
});

// Scenario 2
And('show more buttons are clicked', () => {
  cy.getByDataTest('sliced-filters-show-more-button').click({ multiple: true });
});

Then('numbers of sliced and total filters per facet match', () => {
  expect(totalFiltersByFacet).to.deep.equal(slicedFiltersByFacet);
});

When('show less buttons are clicked', () => {
  cy.getByDataTest('sliced-filters-show-less-button').click({ multiple: true });
});

And('show less button hides all filters above number {int}', (slicedFiltersMax: number) => {
  totalFiltersByFacet.forEach((totalFilters, index) => {
    expect(slicedFiltersByFacet[index]).lte(totalFilters);
    expect(slicedFiltersByFacet[index]).lte(slicedFiltersMax);
  });
});
