import { SearchResponse } from '@empathyco/x-types';
import { getBannersStub } from './banners-stubs.factory';
import { getFacetsStub } from './facets-stubs.factory';
import { getPromotedsStub } from './promoteds-stubs.factory';
import { getRedirectionsStub } from './redirections-stubs.factory';
import { getResultsStub } from './results-stubs.factory';
import { getTaggingResponseStub } from './tagging-response-stubs.factory';

/**
 * Creates a {@link @empathyco/x-types#SearchResponse | search response} stub.
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
    queryTagging: getTaggingResponseStub(),
    redirections: getRedirectionsStub(),
    results: getResultsStub(),
    spellcheck: '',
    totalResults: 100
  };
}
