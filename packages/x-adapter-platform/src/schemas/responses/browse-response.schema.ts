import type { BrowseResponse } from '@empathyco/x-types'
import type { PlatformBrowseResponse } from '../../types/responses/browse-response.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { bannerSchema } from '../models/banner.schema'
import { facetSchema } from '../models/facet.schema'
import { promotedSchema } from '../models/promoted.schema'
import { resultSchema } from '../models/result.schema'
import { statsSchema } from '../models/stats.schema'

/**
 * Default implementation for the BrowseResponseSchema.
 *
 * @public
 */
export const browseResponseSchema = createMutableSchema<PlatformBrowseResponse, BrowseResponse>({
  results: {
    $path: 'catalog.content',
    $subSchema: resultSchema,
  },
  facets: {
    $path: 'catalog.facets',
    $subSchema: facetSchema,
  },
  totalResults: 'catalog.numFound',
  banners: {
    $path: 'banner.content',
    $subSchema: bannerSchema,
  },
  promoteds: {
    $path: 'promoted.content',
    $subSchema: promotedSchema,
  },
  stats: {
    $path: 'catalog.stats',
    $subSchema: statsSchema,
  },
  browseTagging: ({ catalog }) => getTaggingInfoFromUrl(catalog?.tagging?.browseCategory),
  displayBrowseTagging: ({ catalog }) =>
    getDisplayTaggingInfoFromUrl(catalog?.tagging?.displayBrowseCategory),
})
