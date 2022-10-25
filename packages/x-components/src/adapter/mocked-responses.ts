import { SearchResponse } from '@empathyco/x-types';
import {
  createHierarchicalFacetStub,
  createNextQueryStub,
  createNumberRangeFacetStub,
  createPopularSearch,
  createQuerySuggestion,
  createResultStub,
  createSimpleFacetStub,
  getFacetsStub,
  getRelatedTagsStub,
  getResultsStub
} from '../__stubs__/index';

export const mockedApiUrl = 'https://api.empathy.co';

export const getIdentifierResultsEndpoint = `${mockedApiUrl}/identifier-results`;
export const getRecommendationsEndpoint = `${mockedApiUrl}/recommendations`;
export const getQuerySuggestionsEndpoint = `${mockedApiUrl}/query-suggestions`;
export const getRelatedTagsEndpoint = `${mockedApiUrl}/related-tags`;
export const getPopularSearchesEndpoint = `${mockedApiUrl}/popular-searches`;

export const getNextQueriesEndpoint = `${mockedApiUrl}/next-queries`;
export const searchEndpoint = `${mockedApiUrl}/search`;
export const trackEndpoint = `${mockedApiUrl}/track`;

export const mockedResponses = {
  'identifier-results': {
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
  },
  'next-queries': {
    nextQueries: [
      createNextQueryStub('lego'),
      createNextQueryStub('camion'),
      createNextQueryStub('marvel')
    ]
  },
  'popular-searches': {
    suggestions: [
      createPopularSearch('playmobil'),
      createPopularSearch('lego'),
      createPopularSearch('mochila'),
      createPopularSearch('barbie'),
      createPopularSearch('dinosaurio')
    ]
  },
  'query-suggestions': {
    suggestions: [
      createQuerySuggestion('lego'),
      createQuerySuggestion('lego marvel'),
      createQuerySuggestion('lego friends'),
      createQuerySuggestion('lego star wars'),
      createQuerySuggestion('lego city'),
      createQuerySuggestion('lego harry potter')
    ]
  },
  recommendations: {
    results: [
      createResultStub('Piscina 3 Anillos'),
      createResultStub('Among Us Figura Acción'),
      createResultStub('Barbie Sirenas Dreamtopia')
    ]
  },
  search: createSearchResponse({
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
        createFilter('Vehículos y pistas', false, createFilter => [
          createFilter('Radiocontrol', false)
        ]),
        createFilter('Juguetes electrónicos', false, createFilter => [
          createFilter('Imagen y audio', false)
        ]),
        createFilter('Educativos', false, createFilter => [
          createFilter('Juguetes educativos', false)
        ]),
        createFilter('Creativos', false, createFilter => [createFilter('Crea', false)]),
        createFilter('Muñecas', false, createFilter => [
          createFilter('Peluches', false),
          createFilter('Ropa y accesorios', false),
          createFilter('Playsets', false),
          createFilter('Bebés', false),
          createFilter('Carros', false)
        ]),
        createFilter('Construcción', false, createFilter => [createFilter('Construye', false)])
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
  }),
  'related-tags': {
    relatedTags: getRelatedTagsStub()
  }
};

/**
 * Creates a search response.
 *
 * @param partial - Partial search response to override default fields.
 *
 * @returns A complete search response object.
 */
export function createSearchResponse(partial?: Partial<SearchResponse>): SearchResponse {
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
