import type { BrowseResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { bannerSchema } from '../models/banner.schema'
import { browseResultSchema } from '../models/browse-result.schema'
import { facetSchema } from '../models/facet.schema'
import { promotedSchema } from '../models/promoted.schema'
import { statsSchema } from '../models/stats.schema'
import { defined, parseEach } from '../utils'

const content = z.optional(z.looseObject({ content: z.optional(z.array(z.unknown())) }))

/**
 * Default implementation for the BrowseResponseSchema.
 *
 * @public
 */
export const browseResponseSchema = createMutableZodSchema({
  source: z.looseObject({
    catalog: z.optional(
      z.looseObject({
        content: z.optional(z.array(z.unknown())),
        facets: z.optional(z.array(z.unknown())),
        numFound: z.optional(z.number()),
        tagging: z.optional(
          z.looseObject({
            browseCategory: z.optional(z.string()),
            displayBrowseCategory: z.optional(z.string()),
          }),
        ),
        stats: z.optional(z.unknown()),
      }),
    ),
    banner: content,
    promoted: content,
  }),
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
