import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';

let totalResultsNumber: number,
  filteredResultsNumber: number,
  twiceFilteredResultsNumber: number,
  resultsInFilter: number;

/**
 * Check if results number has been refreshed.
 *
 * @param resultsNumber - #results in the previous iteration. It shouldn't match current #results.
 */
function checkResultsAreRefreshed(resultsNumber: number): void {
  cy.getByDataTest('total-results').should('not.have.text', resultsNumber);
}

/**
 * Click on a filter from a certain facet.
 *
 * @param facetName - Name of the facet which the filter to be clicked belongs to.
 * @param nthFilter - Position of the filter to be clicked.
 */
function clickFacetNthFilter(facetName: string, nthFilter: number): void {
  cy.getByDataTest(facetName).eq(nthFilter).click();
}

Given('no special config for multiselect filters view', () => {
  cy.visit('/test/multiselect-filters');
});

Then('number of results are stored', () => {
  cy.getByDataTest('total-results').should($totalResults => {
    totalResultsNumber = Number($totalResults.text());
    expect(totalResultsNumber).gt(0);
  });
});

When(
  'filter number {int} is selected in facet {string}',
  (filterNumber: number, facetName: string) => {
    clickFacetNthFilter(facetName, filterNumber);
  }
);

Then(
  'total number of results equals results from the filter {int} in {string}',
  (filterNumber: number, facetName: string) => {
    checkResultsAreRefreshed(totalResultsNumber);
    cy.getByDataTest('total-results').should($filteredResults => {
      filteredResultsNumber = Number($filteredResults.text());
    });
    cy.getByDataTest(facetName)
      .eq(filterNumber)
      .getByDataTest('filter-total-results')
      .should($resultsPerFilter => {
        resultsInFilter = Number($resultsPerFilter.text());
        expect(filteredResultsNumber).to.equal(resultsInFilter);
      });
  }
);

And('number of results are less than without filters', () => {
  checkResultsAreRefreshed(totalResultsNumber);
  cy.getByDataTest('total-results').should($filteredResults => {
    filteredResultsNumber = Number($filteredResults.text());
    expect(filteredResultsNumber).lt(totalResultsNumber);
  });
});

Then('number of results increases compared with previous stored results', () => {
  checkResultsAreRefreshed(filteredResultsNumber);
  cy.getByDataTest('total-results').should($totalResults => {
    twiceFilteredResultsNumber = Number($totalResults.text());
    expect(twiceFilteredResultsNumber).gt(filteredResultsNumber);
  });
});

And(
  'results from the filter {int} in {string} are added to the total number of results',
  (filterNumber2: number, facetName: string) => {
    cy.getByDataTest(facetName)
      .eq(filterNumber2)
      .getByDataTest('filter-total-results')
      .should($resultsPerFilter => {
        expect(twiceFilteredResultsNumber).to.equal(
          Number($resultsPerFilter.text()) + resultsInFilter
        );
      });
  }
);

And('clear-filters button displays the number of selected filters', () => {
  cy.get('.x-filter--is-selected').then($selectedFilters => {
    const selectedFiltersNumber = $selectedFilters.length;
    cy.getByDataTest('clear-filters').should('contain', selectedFiltersNumber.toString());
  });
});
