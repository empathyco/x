import { PageableRequest, SearchResponse } from '@empathyco/x-adapter';
import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import '../cucumber/global-definitions';
import {
  createHierarchicalFacetStub,
  createNumberRangeFacetStub,
  createResultStub,
  createSimpleFacetStub,
  getNextQueriesStub,
  getPopularSearchesStub,
  getQuerySuggestionsStub,
  getRelatedTagsStub,
  getResultsStub
} from '../../../src/__stubs__';

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

// ID Results
Then('identifier results are displayed', () => {
  cy.getByDataTest('identifier-results-item')
    .should('be.visible')
    .should('have.length.at.least', 1);
});

Then('no identifier results are displayed', () => {
  cy.getByDataTest('identifier-result-item').should('not.exist');
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
  cy.getByDataTest('result-text')
    .should('be.visible')
    .should('have.length.at.least', 1)
    .each($result => {
      resultsList.push($result.text());
    });
});

Then('related results have changed', () => {
  cy.getByDataTest('result-text')
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

Given('a next queries API', () => {
  cy.intercept('https://api.empathy.co/getNextQueries', req => {
    req.reply({
      nextQueries: getNextQueriesStub()
    });
  });
});

Given('a suggestions API', () => {
  cy.intercept('https://api.empathy.co/getSuggestions', req => {
    req.reply({
      suggestions: req.body.query ? getQuerySuggestionsStub('rum') : getPopularSearchesStub()
    });
  });
});

Given('a related tags API', () => {
  cy.intercept('https://api.empathy.co/getRelatedTags', req => {
    req.reply({
      relatedTags: getRelatedTagsStub()
    });
  });
});

Given('a results API', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply({
      banners: [],
      promoteds: [],
      results: getResultsStub()
    });
  }).as('interceptedRawResults');
});

Given('an ID results API', () => {
  cy.intercept('https://api.empathy.co/searchById', req => {
    req.reply({
      results: getResultsStub()
    });
  });
});

Given('a results API with a known response', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply(<SearchResponse>{
      banners: [],
      promoteds: [],
      redirections: [],
      partialResults: [],
      queryTagging: {
        url: 'https://analytics.com',
        params: {}
      },
      spellcheck: '',
      facets: [
        createSimpleFacetStub('brand_facet', createSimpleFilter => [
          createSimpleFilter('Juguetes deportivos', false, 3),
          createSimpleFilter('Puzzles', false, 0),
          createSimpleFilter('Construcción', false, 7),
          createSimpleFilter('Construye', false, 6),
          createSimpleFilter('Disfraces', false, 0)
        ]),
        createNumberRangeFacetStub('price_facet', createNumberRangeFilter => [
          createNumberRangeFilter({ min: 0, max: 10 }, false),
          createNumberRangeFilter({ min: 10, max: 20 }, false),
          createNumberRangeFilter({ min: 20, max: 30 }, false),
          createNumberRangeFilter({ min: 30, max: 40 }, false),
          createNumberRangeFilter({ min: 40, max: 60 }, false),
          createNumberRangeFilter({ min: 60, max: 100 }, false)
        ]),
        createNumberRangeFacetStub('age_facet', createNumberRangeFilter => [
          createNumberRangeFilter({ min: 0, max: 1 }, false),
          createNumberRangeFilter({ min: 1, max: 3 }, false),
          createNumberRangeFilter({ min: 3, max: 6 }, false),
          createNumberRangeFilter({ min: 6, max: 9 }, false),
          createNumberRangeFilter({ min: 9, max: 12 }, false),
          createNumberRangeFilter({ min: 12, max: 99 }, false)
        ]),
        createHierarchicalFacetStub('hierarchical_category', createFilter => [
          ...createFilter('Vehículos y pistas', false, createFilter => [
            ...createFilter('Radiocontrol', false)
          ]),
          ...createFilter('Juguetes electrónicos', false, createFilter => [
            ...createFilter('Imagen y audio', false)
          ]),
          ...createFilter('Educativos', false, createFilter => [
            ...createFilter('Juguetes educativos', false)
          ]),
          ...createFilter('Creativos', false, createFilter => [...createFilter('Crea', false)]),
          ...createFilter('Muñecas', false, createFilter => [
            ...createFilter('Peluches', false),
            ...createFilter('Ropa y accesorios', false),
            ...createFilter('Playsets', false),
            ...createFilter('Bebés', false),
            ...createFilter('Carros', false)
          ]),
          ...createFilter('Construcción', false, createFilter => [
            ...createFilter('Construye', false)
          ])
        ])
      ],
      results: [
        createResultStub('LEGO Super Mario Pack Inicial: Aventuras con Mario - 71360', {
          images: ['https://picsum.photos/seed/1/100/100'],
          price: {
            hasDiscount: false,
            originalValue: 59.99,
            value: 59.99
          }
        }),
        createResultStub('LEGO Duplo Classic Caja de Ladrillos - 1091', {
          images: ['https://picsum.photos/seed/2/100/100'],
          price: {
            hasDiscount: false,
            originalValue: 29.99,
            value: 29.99
          }
        }),
        createResultStub('LEGO City Coche Patrulla de Policía - 60239', {
          images: ['https://picsum.photos/seed/3/100/100'],
          price: {
            hasDiscount: false,
            originalValue: 11.99,
            value: 11.99
          }
        }),
        createResultStub('LEGO City Police Caja de Ladrillos - 60270', {
          images: ['https://picsum.photos/seed/4/100/100'],
          price: {
            hasDiscount: false,
            originalValue: 39.99,
            value: 39.99
          }
        }),
        createResultStub('LEGO Friends Parque para Cachorros - 41396', {
          images: ['https://picsum.photos/seed/5/100/100'],
          price: {
            hasDiscount: false,
            originalValue: 11.99,
            value: 11.99
          }
        }),
        createResultStub('LEGO Creator Ciberdrón - 31111', {
          images: ['https://picsum.photos/seed/6/100/100'],
          price: {
            hasDiscount: false,
            originalValue: 11.99,
            value: 11.99
          }
        }),
        createResultStub('LEGO Technic Dragster - 42103', {
          images: ['https://picsum.photos/seed/7/100/100'],
          price: {
            hasDiscount: false,
            originalValue: 22.99,
            value: 22.99
          }
        })
      ],
      totalResults: 7
    });
  }).as('interceptedResults');
});
