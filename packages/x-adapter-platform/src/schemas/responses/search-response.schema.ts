import type { SearchResponse } from '@empathyco/x-types'
import { z } from 'zod'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { bannerSchema } from '../models/banner.schema'
import { facetSchema } from '../models/facet.schema'
import { partialResultsSchema } from '../models/partial-results.schema'
import { promotedSchema } from '../models/promoted.schema'
import { redirectionSchema } from '../models/redirection.schema'
import { resultSchema } from '../models/result.schema'
import { statsSchema } from '../models/stats.schema'

/**
 * Default implementation for the SearchResponseSchema.
 *
 * @public
 */
export const searchResponseSchema = z
  .object({
    catalog: z
      .object({
        content: z.array(z.any()).optional(),
        facets: z.array(z.any()).optional(),
        numFound: z.number().optional(),
        spellchecked: z.string().optional(),
        partials: z.array(z.any()).optional(),
        stats: z.any().optional(),
        tagging: z
          .object({
            query: z.string().optional(),
            display: z.string().optional(),
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
    direct: z
      .object({
        content: z.array(z.any()).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): SearchResponse => ({
      results: source.catalog?.content?.map(item => resultSchema.parse(item)) ?? [],
      facets: source.catalog?.facets?.map(item => facetSchema.parse(item)) ?? [],
      totalResults: source.catalog?.numFound ?? 0,
      spellcheck: source.catalog?.spellchecked,
      banners: source.banner?.content?.map(item => bannerSchema.parse(item)),
      promoteds: source.promoted?.content?.map(item => promotedSchema.parse(item)),
      redirections: source.direct?.content?.map(item => redirectionSchema.parse(item)),
      partialResults: source.catalog?.partials?.map(item => partialResultsSchema.parse(item)),
      stats: source.catalog?.stats ? statsSchema.parse(source.catalog.stats) : undefined,
      queryTagging: getTaggingInfoFromUrl(source.catalog?.tagging?.query ?? ''),
      displayTagging: getDisplayTaggingInfoFromUrl(source.catalog?.tagging?.display ?? ''),
    }),
  )
