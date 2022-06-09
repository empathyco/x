import { Dictionary } from '@empathyco/x-utils';
import { HttpClient } from './types';
import { buildUrl, toJson } from './utils';

/**
 * Dictionary with the request id as key and an `AbortController` as value.
 */
const requestAbortControllers: Dictionary<AbortController> = {};

/**
 * The `fetchHttpClient()` function is a http client implementation using the `fetch` WebAPI.
 *
 * @param endpoint - The endpoint to make the request to.
 * @param options - The request options.
 *
 * @returns A `Promise` object.
 *
 * @public
 */
export const fetchHttpClient: HttpClient = (
  endpoint,
  { id = endpoint, parameters, properties } = {}
) => {
  const url = buildUrl(endpoint, parameters);
  requestAbortControllers[id]?.abort();
  requestAbortControllers[id] = new AbortController();

  return fetch(url, { ...properties, signal: requestAbortControllers[id].signal }).then(toJson);
};
