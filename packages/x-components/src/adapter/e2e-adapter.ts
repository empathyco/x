import {
  IdentifierResultsRequest,
  IdentifierResultsResponse,
  NextQueriesRequest,
  NextQueriesResponse,
  QuerySuggestionsRequest,
  RecommendationsRequest,
  RecommendationsResponse,
  RelatedTagsRequest,
  RelatedTagsResponse,
  SearchRequest,
  SearchResponse,
  QuerySuggestionsResponse,
  TaggingRequest,
  PopularSearchesRequest,
  PopularSearchesResponse
} from '@empathyco/x-types';
import {
  endpointAdapterFactory,
  ExtendableEndpointAdapter,
  HttpClient
} from '@empathyco/x-adapter-next';
import { PlatformAdapter } from '@empathyco/x-adapter-platform';

/**
 * Mock fetch httpClient.
 *
 * @param endpoint - The endpoint to use.
 * @param options - Additional options to make the request with.
 * @returns A promise wrapped object containing the response.
 */
export const mockedFetchHttpClient: HttpClient = (endpoint, { parameters, properties } = {}) => {
  return fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(parameters),
    ...properties
  }).then(response => response.json());
};

/**
 * Mock beacon httpClient.
 *
 * @param endpoint - The endpoint to use.
 * @param options - Additional options to make the request with.
 * @param _
 * @returns A promise wrapped object.
 */
export const mockedBeaconHttpClient: HttpClient = (
  _,
  { parameters } = { parameters: { url: '', params: {} } }
) => {
  return navigator.sendBeacon(parameters!.url as string, JSON.stringify(parameters!.params))
    ? Promise.resolve<any>({})
    : Promise.reject('sendBeacon rejected');
};

/**
 * Mock EndpointAdapter.
 *
 * @param path - The path of the endpoint to mock.
 * @param httpClient
 * @returns The mocked endpoint adapter.
 */
export function mockEndpointAdapter<Request, Response>(
  path: string,
  httpClient = mockedFetchHttpClient
): ExtendableEndpointAdapter<Request, Response> {
  const endpointAdapter = endpointAdapterFactory<Request, Response>({
    endpoint: `https://api.empathy.co/${path}`,
    httpClient
  });

  endpointAdapter.extends = <NewRequest, NewResponse>() =>
    endpointAdapter as unknown as ExtendableEndpointAdapter<NewRequest, NewResponse>;

  return endpointAdapter;
}

export const e2eAdapter: PlatformAdapter = {
  identifierResults: mockEndpointAdapter<IdentifierResultsRequest, IdentifierResultsResponse>(
    'identifier-results'
  ),
  nextQueries: mockEndpointAdapter<NextQueriesRequest, NextQueriesResponse>('next-queries'),
  popularSearches: mockEndpointAdapter<PopularSearchesRequest, PopularSearchesResponse>(
    'popular-searches'
  ),
  querySuggestions: mockEndpointAdapter<QuerySuggestionsRequest, QuerySuggestionsResponse>(
    'query-suggestions'
  ),
  recommendations: mockEndpointAdapter<RecommendationsRequest, RecommendationsResponse>(
    'recommendations'
  ),
  relatedTags: mockEndpointAdapter<RelatedTagsRequest, RelatedTagsResponse>('related-tags'),
  search: mockEndpointAdapter<SearchRequest, SearchResponse>('search'),
  tagging: mockEndpointAdapter<TaggingRequest, void>('', mockedBeaconHttpClient)
};
