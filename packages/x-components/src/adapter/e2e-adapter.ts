import { XComponentsAdapter } from '@empathyco/x-types';
import { EndpointAdapter, endpointAdapterFactory, HttpClient } from '@empathyco/x-adapter';
import { mockedResponses } from './mocked-responses';

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
 * Mock EndpointAdapter.
 *
 * @param path - The path of the endpoint to mock.
 * @returns The mocked endpoint adapter.
 */
export function mockEndpointAdapter<Request, Response>(
  path: string
): EndpointAdapter<Request, Response> {
  return endpointAdapterFactory<Request, Response>({
    endpoint: `https://api.empathy.co/${path}`,
    httpClient:
      'Cypress' in window
        ? mockedFetchHttpClient
        : () =>
            Promise.resolve(mockedResponses[path as keyof typeof mockedResponses]) as Promise<any>
  });
}

export const e2eAdapter: XComponentsAdapter = {
  identifierResults: mockEndpointAdapter('identifier-results'),
  nextQueries: mockEndpointAdapter('next-queries'),
  popularSearches: mockEndpointAdapter('popular-searches'),
  querySuggestions: mockEndpointAdapter('query-suggestions'),
  recommendations: mockEndpointAdapter('recommendations'),
  relatedTags: mockEndpointAdapter('related-tags'),
  search: mockEndpointAdapter('search'),
  tagging: endpointAdapterFactory({
    endpoint: ({ url }) => url,
    requestMapper: ({ params }) => params,
    httpClient:
      'Cypress' in window ? mockedFetchHttpClient : () => Promise.resolve({}) as Promise<any>,
    defaultRequestOptions: {
      properties: { keepalive: true }
    }
  })
};
