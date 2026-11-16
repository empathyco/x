import type { BrowseResponse } from '@empathyco/x-types'
import type { PlatformBrowseResponseSource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { bannerSchema } from '../models/banner.schema'
import { browseResultSchema } from '../models/browse-result.schema'
import { facetSchema } from '../models/facet.schema'
import { promotedSchema } from '../models/promoted.schema'
import { statsSchema } from '../models/stats.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the BrowseResponseSchema.
 *
 * @public
 */
export const browseResponseSchema = createTransformSchema<
  PlatformBrowseResponseSource,
  BrowseResponse
>({
  transform: ({ catalog, banner, promoted }, context): BrowseResponse => ({
    ...defined<Omit<BrowseResponse, 'browseTagging' | 'displayBrowseTagging'>>({
      results: parseEach(browseResultSchema, catalog?.content, context),
      facets: parseEach(facetSchema, catalog?.facets, context),
      totalResults: catalog?.numFound,
      banners: parseEach(bannerSchema, banner?.content, context),
      promoteds: parseEach(promotedSchema, promoted?.content, context),
      stats: catalog?.stats ? statsSchema.parse(catalog.stats, context) : undefined,
    }),
    browseTagging: getTaggingInfoFromUrl(catalog?.tagging?.browseCategory as string),
    displayBrowseTagging: getDisplayTaggingInfoFromUrl(
      catalog?.tagging?.displayBrowseCategory as string,
    ),
  }),
})
