import { EmpathyAdapterConfig } from './empathy-adapter-config.types';

// TODO Default config
export const DEFAULT_EMPATHY_ADAPTER_CONFIG: EmpathyAdapterConfig = {
  env: 'staging',
  instance: 'demo',
  searchLang: 'es',
  features: {
    nextQueries: {
      endpoint: '',
      responsePath: {
        nextQueries: 'nextQueries'
      }
    },
    recommendations: {
      endpoint: '',
      responsePath: {
        results: 'topclicked.docs'
      }
    },
    relatedTags: {
      endpoint: '',
      responsePath: {
        relatedTags: 'relatedTags'
      }
    },
    search: {
      endpoint: '',
      responsePath: {
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
      endpoint: '',
      responsePath: {
        results: 'content.docs'
      }
    },
    suggestions: {
      endpoint: '',
      responsePath: {
        suggestions: 'topTrends'
      }
    }
  },
  mappings: {
    query: {
      maxLength: 1,
      maxWords: 1
    },
    facets: {}
  }
};
