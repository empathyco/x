import { TaggingRequest } from '@empathyco/x-types';

/**
 * Extracts the tagging info from a URL.
 *
 * @param taggingUrl - The url containing the tagging info.
 *
 * @returns The object with the tagging info.
 */
export function getTaggingInfoFromUrl(taggingUrl: string): TaggingRequest {
  const { url, params } = extractUrlParameters(taggingUrl);
  return {
    url,
    params: {
      ...params,
      follow: false
    }
  };
}

/**
 * Returns the base url path and an object with the query parameters.
 *
 * @param url - The url string to manipulate.
 *
 * @returns The object with the url information.
 */
export function extractUrlParameters(url: string): {
  url: string;
  params?: Record<string, string[] | string>;
} {
  const searchParams = new Map<string, string | string[]>();
  try {
    const urlObject = new URL(url);
    urlObject.searchParams.forEach((value, key) => {
      const param = searchParams.get(key);
      if (Array.isArray(param)) {
        searchParams.set(key, [...param, value]);
      } else if (param) {
        searchParams.set(key, [param, value]);
      } else {
        searchParams.set(key, value);
      }
    });
    return {
      url: `${urlObject.origin}${urlObject.pathname}`,
      params: Object.fromEntries(searchParams)
    };
  } catch (e) {
    //eslint-disable-next-line no-console
    console.warn('Invalid url', url); // TODO Use Empathy's logger
    return {
      url
    };
  }
}
