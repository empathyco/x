import { SearchResponse } from '@empathy/search-adapter';
import { getFacetsStub } from './facets-stubs.factory';
import { getResultsStub } from './results-stubs.factory';
import { getBannersStub } from './banners-stubs.factory';
import { getPromotedsStub } from './promoteds-stubs.factory';

/**
 * Creates {@link @empathy/search-adapter#SearchResponse | search response} stub.
 *
 * @returns Object of search response stub.
 *
 * @internal
 */
export function getSearchResponseStub(): SearchResponse {
  return {
    banners: getBannersStub(),
    facets: getFacetsStub(),
    partialResults: [],
    promoteds: getPromotedsStub(),
    queryTagging: {
      params: {},
      url: ''
    },
    redirections: [],
    results: getResultsStub(),
    spellcheck: '',
    totalResults: 0
  };
}
