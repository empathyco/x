import { Dictionary, forEach } from '@empathyco/x-utils';
import { RequestError } from './errors/request-error';

/**
 * Formats a response object to JSON.
 *
 * @remarks If the `response.ok` is falsy, a `RequestError` object is thrown.
 *
 * @param response - The response to convert to JSON format.
 * @returns - The resultant promise of formatting the response to JSON.
 *
 * @public
 */
export function toJson(response: Response): Promise<any> {
  if (response.ok) {
    return response.text().then(text => (text ? JSON.parse(text) : {}));
  } else {
    throw new RequestError('Request failed', response);
  }
}

/**
 * Builds a URL object based on the passed endpoint and the request parameters.
 *
 * @param endpoint - The endpoint.
 * @param params - The request parameters.
 *
 * @returns The `href` property of the newly built `URL` object.
 *
 * @public
 */
export function buildUrl(endpoint: string, params: Dictionary<unknown> = {}): URL['href'] {
  const url = new URL(endpoint);
  forEach(params, (key, value) =>
    (Array.isArray(value) ? value : [value]).forEach(arrayItemValue =>
      url.searchParams.append(key, String(arrayItemValue))
    )
  );
  return url.href;
}
