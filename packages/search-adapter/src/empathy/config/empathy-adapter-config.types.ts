import {
  NextQueriesResponse,
  RecommendationsResponse,
  RelatedTagsResponse,
  SearchByIdResponse,
  SearchResponse,
  SuggestionsResponse
} from '../../models';

export interface EmpathyAdapterConfig {
  env: 'live' | 'staging' | 'test';
  instance: string;
  searchLang: string;
  features: {
    nextQueries: {
      endpoint: string;
      responsePath: { [key in keyof NextQueriesResponse]: string };
    };
    recommendations: {
      endpoint: string;
      responsePath: { [key in keyof RecommendationsResponse]: string };
    };
    relatedTags: {
      endpoint: string;
      responsePath: { [key in keyof RelatedTagsResponse]: string };
    };
    suggestions: {
      endpoint: string;
      responsePath: { [key in keyof SuggestionsResponse]: string };
    };
    search: {
      endpoint: string;
      responsePath: { [key in keyof SearchResponse]: string }
    }
    searchById: {
      endpoint: string;
      responsePath: { [key in keyof SearchByIdResponse]: string }
    }
  };
  mappings: {
    query: {
      maxWords: number;
      maxLength: number;
    },
    facets: {} // TODO Multiselectable, model, dynamic...
  };
}
