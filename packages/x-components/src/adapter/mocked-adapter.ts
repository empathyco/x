import {
  EmpathyAdapter,
  EmpathyAdapterBuilder,
  NextQueriesRequest,
  NextQueriesResponse,
  RelatedTagsRequest,
  RelatedTagsResponse,
  SearchByIdRequest,
  SearchByIdResponse,
  SearchRequest,
  SearchResponse,
  SearchAdapter,
  SuggestionsRequest,
  SuggestionsResponse,
  TopRecommendationsRequest,
  TopRecommendationsResponse,
  TrackingRequest
} from '@empathyco/x-adapter';
import { noOp } from '../utils/index';
import { configureAdapterWithToysrus } from './util';

declare global {
  interface Window {
    __mockedAdapter: MockedAdapterConfig;
  }
}

type NonRequestMethods =
  | 'invalidateCache'
  | 'setConfig'
  | 'addConfigChangedListener'
  | 'removeConfigChangedListener';
export type AdapterFeatures = Omit<SearchAdapter, NonRequestMethods>;

export type AdapterMockedResponses = {
  [Method in keyof AdapterFeatures]: ReturnType<AdapterFeatures[Method]> extends Promise<
    infer Value
  >
    ? Value | Error
    : never;
};

export interface MockedAdapterConfig {
  delayMs: number;
  responses: Partial<AdapterMockedResponses>;
}

window.__mockedAdapter = {
  delayMs: 100,
  responses: {}
};

class E2ETestsAdapter extends EmpathyAdapter {
  getNextQueries(request: NextQueriesRequest): Promise<NextQueriesResponse> {
    return mockFetch(request, 'getNextQueries');
  }

  getTopRecommendations(request: TopRecommendationsRequest): Promise<TopRecommendationsResponse> {
    return mockFetch(request, 'getTopRecommendations');
  }

  getSuggestions(request: SuggestionsRequest): Promise<SuggestionsResponse> {
    return mockFetch(request, 'getSuggestions');
  }

  getRelatedTags(request: RelatedTagsRequest): Promise<RelatedTagsResponse> {
    return mockFetch(request, 'getRelatedTags');
  }

  search(request: SearchRequest): Promise<SearchResponse> {
    return mockFetch(request, 'search');
  }

  track(request: TrackingRequest): Promise<void> {
    return fetch(request.url, {
      method: 'POST',
      body: JSON.stringify(request.params)
    }).then(noOp);
  }

  searchById(request: SearchByIdRequest): Promise<SearchByIdResponse> {
    return mockFetch(request, 'searchById');
  }
}

export const mockedAdapter = configureAdapterWithToysrus(
  new EmpathyAdapterBuilder(undefined, undefined, E2ETestsAdapter)
).build();

/**
 * Creates a `fetch` call to a non existent API endpoint with the provided request body.
 *
 * @param request - The request's body to use in the `fetch`.
 * @param path - The adapter's feature being mocked that completes the API's endpoint.
 *
 * @returns A promise that resolves with the result of calling a non existent API.
 */
function mockFetch<Feature extends keyof MockedAdapterConfig['responses']>(
  request: Parameters<AdapterFeatures[Feature]>[0],
  path: Feature
): ReturnType<AdapterFeatures[Feature]> {
  return fetch(`https://api.empathy.co/${path}`, {
    method: 'POST',
    body: JSON.stringify(request)
  }).then(response => response.json()) as ReturnType<AdapterFeatures[Feature]>;
}
