import {
  Banner,
  Facet,
  NextQuery,
  PartialResult,
  Promoted,
  Redirection,
  RelatedTag,
  Result,
  Suggestion,
  Tagging
} from '@empathy/search-types';

export interface SearchResponse {
  banners: Banner[];
  facets: Facet[];
  partialResults: PartialResult[];
  promoteds: Promoted[];
  queryTagging: Tagging;
  redirections: Redirection[];
  results: Result[];
  spellcheck: string;
  totalResults: number;
}

export interface NextQueriesResponse {
  nextQueries: NextQuery[];
}

export interface RecommendationsResponse {
  results: Result[];
}

export interface RelatedTagsResponse {
  relatedTags: RelatedTag[];
}

export interface SuggestionsResponse {
  suggestions: Suggestion[];
}

export interface SearchByIdResponse {
  results: Result[];
}
