import type { EndpointAdapter, HttpClient } from '@empathyco/x-adapter'
import type { XComponentsAdapter } from '@empathyco/x-types'
import { endpointAdapterFactory } from '@empathyco/x-adapter'
import { mockedResponses } from './mocked-responses'

/**
 * Mock fetch httpClient.
 *
 * @param endpoint - The endpoint to use.
 * @param options - Additional options to make the request with.
 * @param options.parameters - Option parameters.
 * @param options.properties - Option properties.
 * @returns A promise wrapped object containing the response.
 */
export const mockedFetchHttpClient: HttpClient = async (
  endpoint,
  { parameters, properties } = {},
) => {
  // eslint-disable-next-line ts/no-unsafe-return
  return fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(parameters),
    ...properties,
    // eslint-disable-next-line ts/no-unsafe-return
  }).then(async response => response.json())
}

/**
 * Mock EndpointAdapter.
 *
 * @param path - The path of the endpoint to mock.
 * @returns The mocked endpoint adapter.
 */
export function mockEndpointAdapter<Request, Response>(
  path: string,
): EndpointAdapter<Request, Response> {
  return endpointAdapterFactory<Request, Response>({
    endpoint: `https://api.empathy.co/${path}`,
    httpClient:
      'Cypress' in window
        ? mockedFetchHttpClient
        : async () =>
            // eslint-disable-next-line ts/no-unsafe-return
            Promise.resolve(mockedResponses[path as keyof typeof mockedResponses]) as Promise<any>,
  })
}

export const e2eAdapter: XComponentsAdapter = {
  identifierResults: mockEndpointAdapter('identifier-results'),
  nextQueries: mockEndpointAdapter('next-queries'),
  popularSearches: mockEndpointAdapter('popular-searches'),
  querySuggestions: mockEndpointAdapter('query-suggestions'),
  recommendations: mockEndpointAdapter('recommendations'),
  relatedPrompts: mockEndpointAdapter('related-prompts'),
  relatedTags: mockEndpointAdapter('related-tags'),
  search: mockEndpointAdapter('search'),
  semanticQueries: mockEndpointAdapter('semantic-queries'),
  tagging: endpointAdapterFactory({
    endpoint: ({ url }) => url,
    requestMapper: ({ params }) => params,
    httpClient:
      // eslint-disable-next-line ts/no-unsafe-return
      'Cypress' in window ? mockedFetchHttpClient : async () => Promise.resolve({}) as Promise<any>,
    defaultRequestOptions: {
      properties: { keepalive: true },
    },
  }),
  experienceControls: mockEndpointAdapter('experience-controls'),
  aiQuestions: mockEndpointAdapter('ai-questions'),
}
