import { Dictionary, cleanEmpty, flatObject } from '@empathyco/x-utils';
import { HttpClient } from './types';
import { buildUrl, toJson } from './utils';

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
  { id = endpoint, cancelable = true, parameters = {}, properties, sendParamsInBody = false } = {}
) => {
  const signal = cancelable ? { signal: abortAndGetNewAbortSignal(id) } : {};
  const flatParameters = flatObject(parameters);
  const url = sendParamsInBody ? endpoint : buildUrl(endpoint, cleanEmpty(flatParameters));
  const bodyParameters = sendParamsInBody ? { body: JSON.stringify(cleanEmpty(parameters)) } : {};

  return fetch(url, {
    ...properties,
    ...bodyParameters,
    ...signal
  }).then(toJson);
};

/**
 * Dictionary with the request id as key and an `AbortController` as value.
 */
const requestAbortControllers: Dictionary<AbortController> = {};

/**
 * Function that cancels previous request with the same `id` and returns a new `AbortSignal` for
 * the new request.
 *
 * @param id - The identifier of the request to cancel and create a new `AbortSignal`.
 *
 * @returns The new `AbortSignal`.
 */
function abortAndGetNewAbortSignal(id: string): AbortSignal {
  requestAbortControllers[id]?.abort();
  requestAbortControllers[id] = new AbortController();
  return requestAbortControllers[id].signal;
}
