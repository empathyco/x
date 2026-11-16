import type { SearchResponse } from '@empathyco/x-types'
import type { PlatformSearchResponseSource } from '../source.types'
import { createTransformSchema } from '@empathyco/x-adapter'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { bannerSchema } from '../models/banner.schema'
import { facetSchema } from '../models/facet.schema'
import { partialResultsSchema } from '../models/partial-results.schema'
import { promotedSchema } from '../models/promoted.schema'
import { redirectionSchema } from '../models/redirection.schema'
import { resultSchema } from '../models/result.schema'
import { statsSchema } from '../models/stats.schema'
import { defined, parseEach } from '../utils'

/**
 * Default implementation for the SearchResponseSchema.
 *
 * @public
 */
export const searchResponseSchema = createTransformSchema<
  PlatformSearchResponseSource,
  SearchResponse
>({
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
