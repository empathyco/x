import type { SearchResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { bannerSchema } from '../models/banner.schema'
import { facetSchema } from '../models/facet.schema'
import { partialResultsSchema } from '../models/partial-results.schema'
import { promotedSchema } from '../models/promoted.schema'
import { redirectionSchema } from '../models/redirection.schema'
import { resultSchema } from '../models/result.schema'
import { statsSchema } from '../models/stats.schema'
import { defined, parseEach } from '../utils'

const content = z.optional(z.looseObject({ content: z.optional(z.array(z.unknown())) }))

/**
 * Default implementation for the SearchResponseSchema.
 *
 * @public
 */
export const searchResponseSchema = createMutableZodSchema({
  source: z.looseObject({
    catalog: z.optional(
      z.looseObject({
        content: z.optional(z.array(z.unknown())),
        facets: z.optional(z.array(z.unknown())),
        numFound: z.optional(z.number()),
        spellchecked: z.optional(z.string()),
        partials: z.optional(z.array(z.unknown())),
        tagging: z.optional(
          z.looseObject({ query: z.optional(z.string()), display: z.optional(z.string()) }),
        ),
        stats: z.optional(z.unknown()),
      }),
    ),
    banner: content,
    promoted: content,
    direct: content,
  }),
  transform: ({ catalog, banner, promoted, direct }, context): SearchResponse => ({
    ...defined<Omit<SearchResponse, 'queryTagging' | 'displayTagging'>>({
      results: parseEach(resultSchema, catalog?.content, context),
      facets: parseEach(facetSchema, catalog?.facets, context),
      totalResults: catalog?.numFound,
      spellcheck: catalog?.spellchecked,
      banners: parseEach(bannerSchema, banner?.content, context),
      promoteds: parseEach(promotedSchema, promoted?.content, context),
      redirections: parseEach(redirectionSchema, direct?.content, context),
      partialResults: parseEach(partialResultsSchema, catalog?.partials, context),
      stats: catalog?.stats ? statsSchema.parse(catalog.stats, context) : undefined,
    }),
    queryTagging: getTaggingInfoFromUrl(catalog?.tagging?.query as string),
    displayTagging: getDisplayTaggingInfoFromUrl(catalog?.tagging?.display as string),
  }),
})
