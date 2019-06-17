import { FilterModel, MultiSelect } from '@empathy/search-types';
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
      }
    },
    recommendations: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/topclicked',
      responsePaths: {
        results: 'topclicked.docs'
      }
    },
    relatedTags: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/relatedtags',
      responsePaths: {
        relatedTags: ''
      }
    },
    search: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/search',
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
      }
    },
    searchById: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/skusearch',
      responsePaths: {
        results: 'content.docs'
      }
    },
    suggestions: {
      endpoint: 'api{env}.empathybroker.com/search/v1/query/{instance}/empathize',
      responsePaths: {
        suggestions: 'topTrends'
      }
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
        needsParentFilters: false,
        showUnselectedValues: true,
        preselected: false,
        prefix: {
          facetName: ({ facetName }) => facetName,
          noTagFacetName: ({ facetName }) => facetName
        }
      }, named: {}
    },
    tracking: {
      result: {
        add2cart: 'ebTagging.add2cart',
        click: 'ebTagging.click'
      }
    }
  }
};
