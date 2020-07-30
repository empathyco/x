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

export interface RelatedTagsResponse {
  relatedTags: RelatedTag[];
}

export interface SuggestionsResponse {
  suggestions: Suggestion[];
}

export interface SearchByIdResponse {
  results: Result[];
}

export interface TrackableShowResponse {
  showTagging: Tagging;
}

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

export interface TopRecommendationsResponse {
  results: Result[];
}

export interface SectionRecommendationsResponse extends TrackableShowResponse {
  results: Result[];
}

export interface ClicksRecommendationsResponse extends TrackableShowResponse {
  results: Result[];
  totalResults: number;
}

export interface QueriesRecommendationsResponse extends TrackableShowResponse {
  results: Result[];
  totalResults: number;
}

export interface UserRecommendationsResponse extends TrackableShowResponse {
  results: Result[];
  totalResults: number;
}
