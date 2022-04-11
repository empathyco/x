import { Dictionary } from '@empathyco/x-utils';

/**
 * Makes a request to a backend API using the given parameters.
 *
 * @param endpoint - The endpoint to use.
 * @param options - Additional options to make the request with.
 * @returns A promise wrapped object containing the response.
 * @public
 */
export type HttpClient = <Response = unknown>(
  endpoint: string,
  options?: Omit<RequestOptions, 'endpoint'>
) => Promise<Response>;

/**
 * A record of options to make the request with.
 *
 * @public
 */
export interface RequestOptions {
  /**
   * A unique identifier for this request. Can be used to abort requests with same id.
   */
  id?: string;
  /**
   * A list of parameters to send to the API.
   */
  parameters?: Dictionary<unknown>;
  /**
   * The RequestInit object to create the request with.
   */
  properties?: RequestInit;
  /**
   * The base endpoint that the request should use.
   */
  endpoint?: string;
}
