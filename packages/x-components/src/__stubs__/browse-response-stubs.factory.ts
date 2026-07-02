import type { BrowseResponse } from '@empathyco/x-types'
import { getBannersStub } from './banners-stubs.factory'
import { getFacetsStub } from './facets-stubs.factory'
import { getPromotedsStub } from './promoteds-stubs.factory'
import { getResultsStub } from './results-stubs.factory'
import { getTaggingResponseStub } from './tagging-response-stubs.factory'

/**
 * Creates a {@link @empathyco/x-types#BrowseResponse | browse response} stub.
 *
 * @returns Object of browse response stub.
 *
 * @internal
 */
export function getBrowseResponseStub(): BrowseResponse {
  return {
    banners: getBannersStub(),
    facets: getFacetsStub(),
    promoteds: getPromotedsStub(),
    browseTagging: getTaggingResponseStub(),
    displayBrowseTagging: getTaggingResponseStub(),
    results: getResultsStub(),
    totalResults: 100,
  }
}
