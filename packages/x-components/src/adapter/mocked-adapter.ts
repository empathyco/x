import { SearchAdapter } from '@empathyco/x-adapter';

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

export const mockedAdapter: SearchAdapter = {
  getNextQueries() {
    return tryResolve('getNextQueries');
  },
  getTopRecommendations(request) {
    return mockFetch<'getTopRecommendations'>(request, 'topRecommendations');
  },
  getSectionRecommendations() {
    return tryResolve('getSectionRecommendations');
  },
  getQueriesRecommendations() {
    return tryResolve('getQueriesRecommendations');
  },
  getClicksRecommendations() {
    return tryResolve('getClicksRecommendations');
  },
  getUserRecommendations() {
    return tryResolve('getUserRecommendations');
  },
  getRelatedTags() {
    return tryResolve('getRelatedTags');
  },
  getSuggestions() {
    return tryResolve('getSuggestions');
  },
  search() {
    return tryResolve('search');
  },
  searchById() {
    return tryResolve('searchById');
  },
  track() {
    return tryResolve('track');
  }
};

/**
 * Tries to resolve the data for an adapter call.
 *
 * @param feature - The name of the adapter feature to resolve the data.
 * @returns A promise that resolves with the data if available, or a promise that rejects otherwise.
 */
function tryResolve<Feature extends keyof MockedAdapterConfig['responses']>(
  feature: Feature
): Promise<Exclude<MockedAdapterConfig['responses'][Feature], undefined | Error>> {
  const responseData = window.__mockedAdapter.responses[feature];
  const delay = window.__mockedAdapter.delayMs;

  return responseData === undefined || responseData instanceof Error
    ? rejectIn(delay, responseData)
    : resolveIn(delay, responseData);
}

/**
 * Creates a promise that resolves after the provided milliseconds.
 *
 * @param ms - The milliseconds after the promise should resolve.
 * @param resolveValue - The value that the promise should be resolve with.
 * @returns A promise that resolves with the provided value after the specified milliseconds.
 */
function resolveIn<T>(ms: number, resolveValue: T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(resolveValue);
    }, ms);
  });
}

/**
 * Creates a promise that rejects after the provided milliseconds.
 *
 * @param ms - The milliseconds after the promise should reject.
 * @param rejectionValue - The value that the promise should be rejected with.
 * @returns A promise that is rejected with the provided value after the specified milliseconds.
 */
function rejectIn(ms: number, rejectionValue: unknown): Promise<any> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(rejectionValue);
    }, ms);
  });
}

/**
 * Creates a `fetch` call to a non existent API endpoint with the provided request body.
 *
 * @param request - The request's body to use in the `fetch`.
 * @param mockRoute - String that completes the endpoint route.
 *
 * @returns A promise that resolves with the result of calling a non existent API.
 */
function mockFetch<Feature extends keyof MockedAdapterConfig['responses']>(
  request: Parameters<AdapterFeatures[Feature]>[0],
  mockRoute: string
): Promise<Exclude<MockedAdapterConfig['responses'][Feature], undefined | Error>> {
  return fetch(`https://api.empathy.co/${mockRoute}`, {
    method: 'POST',
    body: JSON.stringify(request)
  }).then(response => {
    return response.json();
  });
}
