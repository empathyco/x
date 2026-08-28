import type { BrowseResponse } from '@empathyco/x-types'
import { z } from 'zod'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { bannerSchema } from '../models/banner.schema'
import { browseResultSchema } from '../models/browse-result.schema'
import { facetSchema } from '../models/facet.schema'
import { promotedSchema } from '../models/promoted.schema'
import { statsSchema } from '../models/stats.schema'

/**
 * Default implementation for the BrowseResponseSchema.
 *
 * @public
 */
export const browseResponseSchema = z
  .object({
    catalog: z
      .object({
        content: z.array(z.any()).optional(),
        facets: z.array(z.any()).optional(),
        numFound: z.number().optional(),
        stats: z.any().optional(),
        tagging: z
          .object({
            browseCategory: z.string().optional(),
            displayBrowseCategory: z.string().optional(),
          })
          .passthrough()
          .optional(),
      })
      .passthrough()
      .optional(),
    banner: z
      .object({
        content: z.array(z.any()).optional(),
      })
      .passthrough()
      .optional(),
    promoted: z
      .object({
        content: z.array(z.any()).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): BrowseResponse => ({
      results: source.catalog?.content?.map(item => browseResultSchema.parse(item)) ?? [],
      facets: source.catalog?.facets?.map(item => facetSchema.parse(item)) ?? [],
      totalResults: source.catalog?.numFound ?? 0,
      banners: source.banner?.content?.map(item => bannerSchema.parse(item)),
      promoteds: source.promoted?.content?.map(item => promotedSchema.parse(item)),
      stats: source.catalog?.stats ? statsSchema.parse(source.catalog.stats) : undefined,
      browseTagging: getTaggingInfoFromUrl(source.catalog?.tagging?.browseCategory ?? ''),
      displayBrowseTagging: getDisplayTaggingInfoFromUrl(
        source.catalog?.tagging?.displayBrowseCategory ?? '',
      ),
    }),
  )
