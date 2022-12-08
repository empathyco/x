import { And, Given } from 'cypress-cucumber-preprocessor/steps';
import {
  NextQueriesResponse,
  RelatedTagsResponse,
  IdentifierResultsResponse,
  SearchRequest,
  SearchResponse,
  QuerySuggestionsResponse,
  RecommendationsResponse,
  PopularSearchesResponse
} from '@empathyco/x-types';
import {
  createBannerStub,
  createPromotedStub,
  createRedirectionStub,
  createRelatedTagStub,
  createResultStub,
  getNextQueriesStub,
  getPopularSearchesStub,
  getQuerySuggestionsStub,
  getResultsStub
} from '../../../src/__stubs__/index';
import {
  createSearchResponse,
  getIdentifierResultsEndpoint,
  getNextQueriesEndpoint,
  getPopularSearchesEndpoint,
  getQuerySuggestionsEndpoint,
  getRecommendationsEndpoint,
  getRelatedTagsEndpoint,
  mockedResponses,
  searchEndpoint,
  trackEndpoint
} from '../../../src/adapter/mocked-responses';

// ID Results
Given('an ID results API', () => {
  cy.intercept(getIdentifierResultsEndpoint, req => {
    req.reply(<IdentifierResultsResponse>{
      results: getResultsStub()
    });
  });
});

Given('an ID results API with a known response', () => {
  cy.intercept(getIdentifierResultsEndpoint, req => {
    req.reply(<IdentifierResultsResponse>mockedResponses['identifier-results']);
  }).as('interceptedIDResults');
});

Given('an ID results API with no results', () => {
  cy.intercept(getIdentifierResultsEndpoint, req => {
    req.reply(<IdentifierResultsResponse>{
      results: []
    });
  }).as('interceptedNoIDResults');
});

// Next Queries
Given('a next queries API', () => {
  cy.intercept(getNextQueriesEndpoint, req => {
    req.reply(<NextQueriesResponse>{
      nextQueries: getNextQueriesStub()
    });
  });
});

Given('a next queries API with a known response', () => {
  cy.intercept(getNextQueriesEndpoint, req => {
    req.reply(<NextQueriesResponse>mockedResponses['next-queries']);
  }).as('interceptedNextQueries');
});

Given('a next queries API with no next queries', () => {
  cy.intercept(getNextQueriesEndpoint, req => {
    req.reply(<NextQueriesResponse>{
      nextQueries: []
    });
  }).as('interceptedNextQueries');
});

// Partial Results
Given('a results API with partial results', () => {
  cy.intercept(searchEndpoint, req => {
    req.reply(<SearchResponse>{
      banners: [],
      promoteds: [],
      spellcheck: '',
      totalResults: 1,
      queryTagging: {
        url: 'https://api.empathy.co/',
        params: {}
      },
      redirections: [],
      results: [
        createResultStub('LEGO Super Mario Pack Inicial: Aventuras con Mario - 71360', {
          images: ['https://picsum.photos/seed/1/100/100']
        })
      ],
      facets: [],
      partialResults: [
        {
          query: 'verde azul',
          results: [
            createResultStub('Twister', {
              images: ['https://picsum.photos/seed/30/100/100']
            }),
            createResultStub('Juego de Anillas Acuáticas Peces', {
              images: ['https://picsum.photos/seed/31/100/100']
            }),
            createResultStub('Jurassic World Dinosaurio de Ataque Varios Modelos', {
              images: ['https://picsum.photos/seed/32/100/100']
            })
          ],
          totalResults: 9
        },
        {
          query: 'lego verde',
          results: [
            createResultStub('LEGO Classic Ladrillos Creativos Verdes - 11007', {
              images: ['https://picsum.photos/seed/33/100/100']
            }),
            createResultStub('LEGO Creator Grandes Dinosaurios -31058', {
              images: ['https://picsum.photos/seed/34/100/100']
            }),
            createResultStub('LEGO My City Casa Familiar - 60291', {
              images: ['https://picsum.photos/seed/35/100/100']
            })
          ],
          totalResults: 6
        }
      ]
    });
  }).as('interceptedPartialResults');
});

// Popular Searches
Given('a popular searches API with a known response', () => {
  cy.intercept(getPopularSearchesEndpoint, req => {
    req.reply(<PopularSearchesResponse>mockedResponses['popular-searches']);
  }).as('interceptedPopularSearches');
});

// Query Suggestions
Given('a query suggestions API with a known response', () => {
  cy.intercept(getQuerySuggestionsEndpoint, req => {
    req.reply(<QuerySuggestionsResponse>mockedResponses['query-suggestions']);
  }).as('interceptedQuerySuggestions');
});

Given('a query suggestions API with no query suggestions', () => {
  cy.intercept(getQuerySuggestionsEndpoint, req => {
    req.reply(<QuerySuggestionsResponse>{
      suggestions: []
    });
  }).as('interceptedQuerySuggestions');
});

// Recommendations
Given('a recommendations API with a known response', () => {
  cy.intercept(getRecommendationsEndpoint, req => {
    req.reply(<RecommendationsResponse>mockedResponses.recommendations);
  }).as('interceptedRecommendations');
});

// Related Tags
Given('a related tags API', () => {
  cy.intercept(getRelatedTagsEndpoint, req => {
    req.reply(<RelatedTagsResponse>mockedResponses['related-tags']);
  });
});

Given('a related tags API with a known response', () => {
  cy.intercept(getRelatedTagsEndpoint, req => {
    req.reply(<RelatedTagsResponse>{
      relatedTags: [
        createRelatedTagStub('funko marvel', 'marvel'),
        createRelatedTagStub('funko pop', 'pop'),
        createRelatedTagStub('funko harry', 'harry')
      ]
    });
  }).as('interceptedRelatedTags');
});

Given('a second related tags API with a known response', () => {
  cy.intercept(getRelatedTagsEndpoint, req => {
    req.reply(<RelatedTagsResponse>{
      relatedTags: [
        createRelatedTagStub('funko spiderman', 'spiderman'),
        createRelatedTagStub('funko deadpool', 'deadpool'),
        createRelatedTagStub('funko loki', 'loki')
      ]
    });
  }).as('interceptedRelatedTagsWithSelection');
});

// Results
Given('a results API with a known response', () => {
  cy.intercept(searchEndpoint, req => {
    req.reply(mockedResponses.search);
  }).as('interceptedResults');
});

Given('a second results API with a known response', () => {
  cy.intercept(searchEndpoint, req => {
    req.reply(
      createSearchResponse({
        results: [
          createResultStub('LEGO Duplo Disney Tren de Cumpleaños de Mickey y Minnie - 10941', {
            images: ['https://picsum.photos/seed/8/100/100']
          }),
          createResultStub('LEGO Disney Granja de Mickey Mouse y el Pato Donald - 10775', {
            images: ['https://picsum.photos/seed/10/100/100']
          })
        ],
        totalResults: 7
      })
    );
  }).as('interceptedNewResults');
});

Given('a results API with {int} results', (resultsLength: number) => {
  cy.intercept(searchEndpoint, req => {
    req.reply(
      createSearchResponse({
        results: Array.from({ length: resultsLength }, (_, index) =>
          createResultStub(`Result ${index}`, {
            images: [`https://picsum.photos/seed/${index}/100/100`]
          })
        ),
        totalResults: resultsLength
      })
    );
  }).as('interceptedResults');
});

Given('a results API with no results', () => {
  cy.intercept(searchEndpoint, req => {
    req.reply(
      createSearchResponse({
        results: [],
        totalResults: 0
      })
    );
  }).as('interceptedNoResults');
});

Given('a results API with broken images', () => {
  cy.intercept(searchEndpoint, req => {
    req.reply(
      createSearchResponse({
        totalResults: 3,
        results: [
          createResultStub('Result 1', {
            images: [
              'https://picsum.photos/seed/18/100/100',
              'https://picsum.photos/seed/2/100/100'
            ],
            price: {
              hasDiscount: false,
              originalValue: 59.99,
              value: 59.99
            }
          }),
          createResultStub('Result 2', {
            images: ['https://notexistsimage1.com', 'https://notexistsimage2.com'],
            price: {
              hasDiscount: false,
              originalValue: 59.99,
              value: 59.99
            }
          }),
          createResultStub('Result 3', {
            images: [
              'https://notexistsimage1.com',
              'https://notexistsimage2.com',
              'https://notexistsimage3.com',
              'https://picsum.photos/seed/20/100/100'
            ],
            price: {
              hasDiscount: false,
              originalValue: 59.99,
              value: 59.99
            }
          })
        ]
      })
    );
  }).as('interceptedFallbackResults');
});

Given('a results API with {int} pages', (numberOfPages: number) => {
  cy.intercept(searchEndpoint, req => {
    const { rows = 24, start = 0 }: SearchRequest = JSON.parse(req.body);
    req.reply(
      createSearchResponse({
        results: Array.from({ length: rows }, (_, index) =>
          createResultStub(`Result ${start + index}`, {
            images: [`https://picsum.photos/seed/${start + index}/100/100`]
          })
        ),
        totalResults: numberOfPages * rows,
        queryTagging: {
          url: `${trackEndpoint}/query`,
          params: { page: 2 }
        }
      })
    );
  }).as('interceptedResults');
});

Given('a results API', () => {
  cy.intercept('https://api.empathy.co/search', req => {
    req.reply(createSearchResponse());
  }).as('interceptedRawResults');
});

Given('a results API with a promoted', () => {
  cy.intercept(searchEndpoint, req => {
    req.reply(createSearchResponse({ promoteds: [createPromotedStub('Promotion')] }));
  }).as('interceptedResults');
});

Given('a results API with a banner', () => {
  cy.intercept(searchEndpoint, req => {
    req.reply(createSearchResponse({ banners: [createBannerStub('Banner')] }));
  }).as('interceptedResults');
});

Given('a results API with a redirection', () => {
  cy.intercept(searchEndpoint, req => {
    req.reply(createSearchResponse({ redirections: [createRedirectionStub('Redirection')] }));
  }).as('interceptedResults');
});

And('waiting for search request intercept', () => {
  cy.intercept('https://api.empathy.co/search').as('requestWithFilter');
});

// Spellcheck
Given('a results API response for a misspelled word', () => {
  cy.intercept(searchEndpoint, req => {
    req.reply(createSearchResponse({ spellcheck: 'lego' }));
  });
});

// Query Suggestions
Given('a query suggestions API', () => {
  cy.intercept(getQuerySuggestionsEndpoint, req => {
    req.reply(<QuerySuggestionsResponse>{
      suggestions: getQuerySuggestionsStub('rum')
    });
  });
});

// Popular Searches
Given('a popular searches API', () => {
  cy.intercept(getPopularSearchesEndpoint, req => {
    req.reply(<PopularSearchesResponse>{
      suggestions: getPopularSearchesStub()
    });
  });
});

// Tracking
Given('a tracking API', () => {
  cy.intercept(`${trackEndpoint}/*`, { statusCode: 200, body: {} });
});

Given('a tracking API with a known response', () => {
  cy.intercept('**/track/query', { statusCode: 200, body: {} }).as('queryTagging');
  cy.intercept('**/track/click', { statusCode: 200, body: {} }).as('clickTagging');
  cy.intercept('**/track/add2cart', { statusCode: 200, body: {} }).as('addToCartTagging');
});
