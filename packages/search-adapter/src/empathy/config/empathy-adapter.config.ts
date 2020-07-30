import { FilterModel, MultiSelect } from '@empathy/search-types';
import { DEFAULT_CACHE_CONFIG } from './cache.config';
import { EmpathyAdapterConfig } from './empathy-adapter-config.types';

export const DEFAULT_EMPATHY_ADAPTER_CONFIG: EmpathyAdapterConfig = {
  env: 'live',
  instance: 'demo',
  requestParams: {
    scope: 'desktop',
    lang: 'en'
  },
  features: {
    nextQueries: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/nextqueries',
      responsePaths: {
        nextQueries: ''
      },
      cacheTTLInMinutes: DEFAULT_CACHE_CONFIG.TTLInMinutes.Side
    },
    topRecommendations: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/topclicked',
      responsePaths: {
        results: 'topclicked.docs'
      },
      cacheTTLInMinutes: DEFAULT_CACHE_CONFIG.TTLInMinutes.Side
    },
    sectionRecommendations: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/dw-topclicked',
      responsePaths: {
        results: 'docs',
        showTagging: 'ebTagging.query'
      },
      cacheTTLInMinutes: DEFAULT_CACHE_CONFIG.TTLInMinutes.Side
    },
    clicksRecommendations: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/dw-lastsearches',
      responsePaths: {
        results: 'docs',
        totalResults: 'numFound',
        showTagging: 'ebTagging.query'
      },
      cacheTTLInMinutes: DEFAULT_CACHE_CONFIG.TTLInMinutes.Side
    },
    queriesRecommendations: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/dw-productsbyqueries',
      responsePaths: {
        results: 'docs',
        totalResults: 'numFound',
        showTagging: 'ebTagging.query'
      },
      cacheTTLInMinutes: DEFAULT_CACHE_CONFIG.TTLInMinutes.Side
    },
    userRecommendations: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/dw-contextualizedproducts',
      responsePaths: {
        results: 'docs',
        totalResults: 'numFound',
        showTagging: 'ebTagging.query'
      },
      cacheTTLInMinutes: DEFAULT_CACHE_CONFIG.TTLInMinutes.Side
    },
    relatedTags: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/relatedtags',
      responsePaths: {
        relatedTags: ''
      },
      cacheTTLInMinutes: DEFAULT_CACHE_CONFIG.TTLInMinutes.Side
    },
    search: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/searchX',
      responsePaths: {
        banners: 'banner',
        facets: 'content.facets',
        partialResults: 'content.suggestions',
        promoteds: 'promoted',
        queryTagging: 'content.ebTagging.query',
        redirections: 'direct',
        results: 'content.docs',
        spellcheck: 'content.spellchecked',
        totalResults: 'content.numFound'
      },
      cacheTTLInMinutes: DEFAULT_CACHE_CONFIG.TTLInMinutes.Catalog
    },
    searchById: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/skusearch',
      responsePaths: {
        results: 'content.docs'
      },
      cacheTTLInMinutes: DEFAULT_CACHE_CONFIG.TTLInMinutes.Catalog
    },
    suggestions: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/empathize',
      responsePaths: {
        suggestions: 'topTrends'
      },
      cacheTTLInMinutes: DEFAULT_CACHE_CONFIG.TTLInMinutes.Side
    },
    track: {
      endpoint: '',
      responsePaths: {}
    }
  },
  mappings: {
    query: {
      maxLength: 128,
      maxWords: 8
    },
    facets: {
      default: {
        filterModelName: FilterModel.simple,
        isDynamic: false,
        multiSelectable: MultiSelect.Disabled,
        showUnselectedValues: true,
        prefix: {
          facetName: ({ facetName }) => facetName,
          noTagFacetName: ({ facetName }) => facetName
        }
      }, named: {}
    },
    tracking: {
      result: {
        add2cart: 'ebTagging.add2cart',
        click: 'ebTagging.click',
        checkout: 'ebTagging.checkout'
      }
    }
  }
};
