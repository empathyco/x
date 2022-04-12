import { HttpClient } from '../types/http-client.types';
import { buildUrl } from './utils';

/**
 * Flag determining if the user has an ad-blocker installed.
 */
let hasAdBlocker: boolean | undefined = undefined;

/**
 * The `beaconHttpClient()` function is a http client implementation using the WebAPI
 * `navigator.sendBeacon`.
 *
 * @remarks As a `navigation.sendBeacon` request might be cancelled by an ad-blocker, the function
 * firstly checks if an ad-blocker is installed. In case it is, the `fetch` API is used as fallback.
 *
 * @param endpoint - The endpoint to make the request to.
 * @param options - The request options.
 *
 * @public
 */
export const beaconHttpClient: HttpClient = async (endpoint, { parameters, properties } = {}) => {
  const url = buildUrl(endpoint, parameters);

  if (hasAdBlocker === undefined) {
    try {
      const response = await detectAdBlocker();
      // The Promise returned from fetch() won't reject on HTTP error status even if the response is
      // an HTTP 404 or 500. Instead, it will resolve normally (with ok status set to false), and it
      // will only reject on network failure or if anything prevented the request from completing.
      // eslint-disable-next-line require-atomic-updates
      hasAdBlocker = !response.ok;
    } catch (_error) {
      // eslint-disable-next-line require-atomic-updates
      hasAdBlocker = true;
    }
  }

  if (hasAdBlocker) {
    return fetch(url, properties);
  } else {
    navigator.sendBeacon(url);

    return Promise.resolve<any>({});
  }
};

/**
 * The `detectAdBlocker()` function checks if the user has an ad-blocker installed.
 *
 * @returns A Promise object. If the `response` is `ok`, no ad-blocker is installed. Otherwise, an
 * ad-blocker is active.
 *
 * @internal
 */
function detectAdBlocker(): Promise<Response> {
  return fetch('https://google.com/pagead/js/adsbygoogle.js', {
    method: 'HEAD',
    mode: 'no-cors'
  });
}
