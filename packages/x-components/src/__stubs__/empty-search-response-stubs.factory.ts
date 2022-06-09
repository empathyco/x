import { SearchResponse } from '@empathyco/x-types';

/**
 * Creates an empty {@link @empathyco/x-types#SearchResponse | search response} stub.
 *
 * @returns Object of an empty search response stub.
 *
 * @internal
 */
export function getEmptySearchResponseStub(): SearchResponse {
  return {
    banners: [],
    facets: [],
    partialResults: [],
    promoteds: [],
    queryTagging: {
      params: {},
      url: ''
    },
    redirections: [],
    results: [],
    spellcheck: '',
    totalResults: 0
  };
}
