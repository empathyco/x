import { Dictionary } from './types';

/**
 * Returns the base url path and an object with the query parameters.
 *
 * @param url - The url string to manipulate.
 *
 * @returns The object with the url information.
 */
export function extractUrlParameters(url: string): Record<string, any> {
  const params: Dictionary = {};
  const urlObject = new URL(url);
  urlObject.searchParams.forEach((value, key) => {
    if (Array.isArray(params[key])) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      params[key].push(value);
    } else if (params[key]) {
      params[key] = [params[key], value];
    } else {
      params[key] = value;
    }
  });
  params.follow = false;
  return {
    url: `${urlObject.origin}${urlObject.pathname}`,
    params
  };
}
