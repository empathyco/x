import { PageableRequest } from '@empathyco/x-adapter';
import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import '../cucumber/global-definitions';

let resultsList: string[] = [];

/**
 * Click on a filter from a certain facet.
 *
 * @param facetName - Name of the facet which the filter to be clicked belongs to.
 * @param nthFilter - Position of the filter to be clicked.
 *
 * @internal
 */
function clickFacetNthFilter(facetName: string, nthFilter: number): void {
  getElementBy(facetName).eq(nthFilter).click().invoke('text').as(`clickedFilter${nthFilter}`);
}

/**
 * Finds an HTMLElement based on a facetName.
 *
 * @param facetName - Name of the facet which the filter to be clicked belongs to.
 * @returns HTMLElement - The filter's element.
 */
function getElementBy(facetName: string): Cypress.Chainable<JQuery<HTMLElement>> {
  return facetName === 'hierarchical_category'
    ? cy.getByDataTest(`${facetName}-filter`).getByDataTest('filter')
    : cy.getByDataTest(`${facetName}-filter`);
}

// Init
Given('no special config for layout view', () => {
  cy.visit('/?useMockedAdapter=true');
});

When('start button is clicked', () => {
  cy.getByDataTest('open-modal').click();
});

// Facets
When(
  'filter number {int} is clicked in facet {string}',
  (filterNumber: number, facetName: string) => {
    clickFacetNthFilter(facetName, filterNumber);
  }
);

Then(
  'search request contains selected filter number {int} is {boolean}',
  function (this: any, simpleFilterIndex: number, isContained: boolean) {
    cy.wait('@requestWithFilter')
      .its('request.body')
      .should(`${isContained ? '' : 'not.'}contain`, this[`clickedFilter${simpleFilterIndex}`]);
  }
);

Then(
  'selection status of filter number {int} in facet {string} is {boolean}',
  function (this: any, simpleFilterIndex: number, facetName: string, isSelected: boolean) {
    cy.getByDataTest(`${facetName}-filter`)
      .contains(this[`clickedFilter${simpleFilterIndex}`])
      .should(`${isSelected ? '' : 'not.'}to.have.class`, 'x-filter--is-selected');
  }
);

// History Queries
When('clear history queries button is clicked', () => {
  cy.getByDataTest('clear-history-queries').click();
});

Then('history queries are displayed', () => {
  cy.getByDataTest('history-query').should('have.length.at.least', 1);
});

Then(
  'the searched query is displayed in history queries',
  function (this: { searchedQuery: string }) {
    cy.getByDataTest('history-query')
      .should('have.length.at.least', 1)
      .each(historyQuery => expect(historyQuery).to.contain(this.searchedQuery))
      .invoke('text')
      .as('historicalQuery');
  }
);

// Next Queries
Then('next queries are displayed', () => {
  cy.getByDataTest('next-query').should('have.length.at.least', 1).invoke('text').as('nextQueries');
});

// Query Suggestions
Then('query suggestions are displayed', () => {
  cy.getByDataTest('query-suggestion').should('have.length.at.least', 1);
});

Then('related tags are displayed', () => {
  cy.getByDataTest('related-tag').should('have.length.at.least', 1);
});

// Results
Then('related results are displayed', () => {
  resultsList = [];
  cy.getByDataTest('search-result')
    .should('be.visible')
    .should('have.length.at.least', 1)
    .getByDataTest('result-title')
    .each($resultTitle => {
      resultsList.push($resultTitle.text());
    });
});

Then('related results have changed', () => {
  cy.getByDataTest('search-result')
    .should('be.visible')
    .should($results => {
      const compoundResultsList = $results
        .toArray()
        .map(resultElement => resultElement.textContent);
      expect(compoundResultsList.every(item => resultsList.includes(item!))).to.eq(false);
    });
});

// Search Box

When('search-input is focused', () => {
  cy.focusSearchInput();
});

When('a {string} with results is typed', (query: string) => {
  cy.typeQuery(query).then(() => {
    cy.getByDataTest('search-input').invoke('val').as('searchedQuery');
  });
});

When('{string} is searched', (query: string) => {
  cy.searchQuery(query).then(() => {
    cy.getByDataTest('search-input').invoke('val').as('searchedQuery');
  });
});

When('clear search button is pressed', () => {
  cy.clearSearchInput();
});

Then(
  'the searched query is displayed in the search-box',
  function (this: { searchedQuery: string }) {
    cy.getByDataTest('search-input').should('have.value', this.searchedQuery);
  }
);

Then(
  'number of rows requested in {string} is {int}',
  (request: string, maxItemsToRequest: number) => {
    cy.wait(`@${request}`).then(({ request }) => {
      const { rows } = JSON.parse(request.body) as PageableRequest;
      expect(rows).to.equal(maxItemsToRequest);
    });
  }
);

When('tab is reloaded', () => {
  cy.reload();
});
