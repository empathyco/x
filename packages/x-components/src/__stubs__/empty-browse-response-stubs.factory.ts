import type { BrowseResponse } from '@empathyco/x-types'

/**
 * Creates an empty {@link @empathyco/x-types#BrowseResponse | browse response} stub.
 *
 * @returns Object of an empty browse response stub.
 *
 * @internal
 */
export function getEmptyBrowseResponseStub(): BrowseResponse {
  return {
    banners: [],
    facets: [],
    promoteds: [],
    browseTagging: {
      params: {},
      url: '',
    },
    displayBrowseTagging: {
      params: {},
      url: '',
    },
    results: [],
    totalResults: 0,
  }
}
