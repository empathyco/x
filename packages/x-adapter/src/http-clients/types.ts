import type { Dictionary } from '@empathyco/x-utils'

/**
 * Makes a request to a backend API using the given parameters.
 *
 * @param endpoint - The endpoint to use.
 * @param options - Additional options to make the request with.
 * @returns A promise wrapped object containing the response.
 * @public
 */
export type HttpClient = (
  endpoint: string,
  options?: Omit<RequestOptions, 'endpoint'>,
) => Promise<any>

/**
 * A record of options to make the request with.
 *
 * @public
 */
export interface RequestOptions {
  /**
   * A unique identifier for this request. Can be used to abort requests with same id.
   */
  id?: string
  /**
   * True if the request can be cancelled.
   */
  cancelable?: boolean
  /**
   * A flag to send parameters in the body if true or in the url QueryString if false.
   */
  sendParamsInBody?: boolean
  /**
   * A flag to always send the parameters even if their values are empty.
   */
  sendEmptyParams?: boolean
  /**
   * A list of parameters to send to the API.
   */
  parameters?: Dictionary<unknown>
  /**
   * The RequestInit object to create the request with.
   */
  properties?: RequestInit
  /**
   * The base endpoint that the request should use.
   */
  endpoint?: string
}
