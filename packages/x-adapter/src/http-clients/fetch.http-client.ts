import type { Dictionary } from '@empathyco/x-utils'
import type { HttpClient } from './types'
import { cleanEmpty, flatObject } from '@empathyco/x-utils'
import { buildUrl, toJson } from './utils'

/**
 * The `rawFetchHttpClient()` function is a http client implementation using the `fetch` WebAPI.
 *
 * @param endpoint - The endpoint to make the request to.
 * @param options - The request options.
 * @param options.cancelable - Cancelable option.
 * @param options.id - ID option.
 * @param options.parameters - Parameters option.
 * @param options.properties - Properties option.
 * @param options.sendEmptyParams - SendEmptyParams option.
 * @param options.sendParamsInBody - SendParamsInBody option.
 *
 * @returns A `Promise` object.
 *
 * @public
 */
export const rawFetchHttpClient: HttpClient = async (
  endpoint,
  {
    id = endpoint,
    cancelable = true,
    parameters = {},
    properties,
    sendParamsInBody = false,
    sendEmptyParams = false,
  } = {},
) => {
  const signal = cancelable ? { signal: abortAndGetNewAbortSignal(id) } : {}
  if (!sendEmptyParams) {
    parameters = cleanEmpty(parameters)
  }
  const flatParameters = flatObject(parameters)
  const url = sendParamsInBody ? endpoint : buildUrl(endpoint, flatParameters)
  const bodyParameters = sendParamsInBody ? { body: JSON.stringify(parameters) } : {}

  return fetch(url, {
    ...properties,
    ...bodyParameters,
    ...signal,
  })
}

/**
 * The `fetchHttpClient()` function is wrapper of `rawFetchHttpClient()` function that parses
 * the response with `toJson` function.
 *
 * @param endpoint - The endpoint to make the request to.
 * @param options - The request options.
 *
 * @returns A `Promise` object.
 *
 * @public
 */
export const fetchHttpClient: HttpClient = async (endpoint, options = {}) =>
  rawFetchHttpClient(endpoint, options).then(toJson)

/**
 * Dictionary with the request id as key and an `AbortController` as value.
 */
const requestAbortControllers: Dictionary<AbortController> = {}

/**
 * Function that cancels previous request with the same `id` and returns a new `AbortSignal` for
 * the new request.
 *
 * @param id - The identifier of the request to cancel and create a new `AbortSignal`.
 *
 * @returns The new `AbortSignal`.
 */
function abortAndGetNewAbortSignal(id: string): AbortSignal {
  requestAbortControllers[id]?.abort()
  requestAbortControllers[id] = new AbortController()
  return requestAbortControllers[id].signal
}
