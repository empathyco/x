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
  createHierarchicalFacetStub,
  createNextQueryStub,
  createNumberRangeFacetStub,
  createPopularSearch,
  createPromotedStub,
  createQuerySuggestion,
  createRedirectionStub,
  createRelatedTagStub,
  createResultStub,
  createSimpleFacetStub,
  getFacetsStub,
  getNextQueriesStub,
  getPopularSearchesStub,
  getQuerySuggestionsStub,
  getRelatedTagsStub,
  getResultsStub
} from '../../../src/__stubs__/index';

const mockedApiUrl = 'https://api.empathy.co';

const getIdentifierResultsEndpoint = `${mockedApiUrl}/identifier-results`;
const getRecommendationsEndpoint = `${mockedApiUrl}/recommendations`;
const getQuerySuggestionsEndpoint = `${mockedApiUrl}/query-suggestions`;
const getPopularSearchesEndpoint = `${mockedApiUrl}/popular-searches`;

const getNextQueriesEndpoint = `${mockedApiUrl}/next-queries`;
const getRelatedTagsEndpoint = `${mockedApiUrl}/getRelatedTags`;
const searchEndpoint = `${mockedApiUrl}/search`;
const trackEndpoint = `${mockedApiUrl}/track`;

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
    req.reply(<IdentifierResultsResponse>{
      results: [
        createResultStub('A0255072 - 9788467577112 - 160000', {
          images: ['https://picsum.photos/seed/20/100/100']
        }),
        createResultStub('A0273378 - 9788467579543 - 166664', {
          images: ['https://picsum.photos/seed/21/100/100']
        }),
        createResultStub('A0291017 - 9788467579536 - 166663', {
          images: ['https://picsum.photos/seed/22/100/100']
        }),
        createResultStub('A0246951 - 8437006044851 - 4001', {
          images: ['https://picsum.photos/seed/23/100/100']
        })
      ]
    });
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
    req.reply(<NextQueriesResponse>{
      nextQueries: [
        createNextQueryStub('lego'),
        createNextQueryStub('camion'),
        createNextQueryStub('marvel')
      ]
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
    req.reply(<PopularSearchesResponse>{
      suggestions: [
        createPopularSearch('playmobil'),
        createPopularSearch('lego'),
        createPopularSearch('mochila'),
        createPopularSearch('barbie'),
        createPopularSearch('dinosaurio')
      ]
    });
  }).as('interceptedPopularSearches');
});

// Query Suggestions
Given('a query suggestions API with a known response', () => {
  cy.intercept(getQuerySuggestionsEndpoint, req => {
    req.reply(<QuerySuggestionsResponse>{
      suggestions: [
        createQuerySuggestion('lego'),
        createQuerySuggestion('lego marvel'),
        createQuerySuggestion('lego friends'),
        createQuerySuggestion('lego star wars'),
        createQuerySuggestion('lego city'),
        createQuerySuggestion('lego harry potter')
      ]
    });
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
    req.reply(<RecommendationsResponse>{
      results: [
        createResultStub('Piscina 3 Anillos'),
        createResultStub('Among Us Figura Acción'),
        createResultStub('Barbie Sirenas Dreamtopia')
      ]
    });
  }).as('interceptedRecommendations');
});

// Related Tags
Given('a related tags API', () => {
  cy.intercept(getRelatedTagsEndpoint, req => {
    req.reply(<RelatedTagsResponse>{
      relatedTags: getRelatedTagsStub()
    });
  });
});

Given('a related tags API with a known response', () => {
  cy.intercept(getRelatedTagsEndpoint, req => {
    req.reply(<RelatedTagsResponse>{
      relatedTags: [
        createRelatedTagStub('funko', 'marvel'),
        createRelatedTagStub('funko', 'pop'),
        createRelatedTagStub('funko', 'harry')
      ]
    });
  }).as('interceptedRelatedTags');
});

Given('a second related tags API with a known response', () => {
  cy.intercept(getRelatedTagsEndpoint, req => {
    req.reply(<RelatedTagsResponse>{
      relatedTags: [
        createRelatedTagStub('funko', 'spiderman'),
        createRelatedTagStub('funko', 'deadpool'),
        createRelatedTagStub('funko', 'loki')
      ]
    });
  }).as('interceptedRelatedTagsWithSelection');
});

// Results
Given('a results API with a known response', () => {
  cy.intercept(searchEndpoint, req => {
    req.reply(
      createSearchResponse({
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
      })
    );
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

/**
 * Creates a search response.
 *
 * @param partial - Partial search response to override default fields.
 * @returns A complete search response object.
 */
function createSearchResponse(partial?: Partial<SearchResponse>): SearchResponse {
  return {
    banners: [],
    promoteds: [],
    facets: getFacetsStub(),
    results: getResultsStub(),
    redirections: [],
    partialResults: [],
    totalResults: 24,
    queryTagging: {
      url: `${trackEndpoint}/query`,
      params: { page: 1 }
    },
    spellcheck: '',
    ...partial
  };
}

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
  cy.intercept(`${trackEndpoint}/*`, req => {
    req.reply({});
  });
});

Given('a tracking API with a known response', () => {
  cy.intercept('**/track/query', { statusCode: 200 }).as('queryTagging');
  cy.intercept('**/track/click', { statusCode: 200 }).as('clickTagging');
  cy.intercept('**/track/add2cart', { statusCode: 200 }).as('addToCartTagging');
});
