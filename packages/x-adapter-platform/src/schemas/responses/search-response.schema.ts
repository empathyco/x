import type { SearchResponse } from '@empathyco/x-types'
import type { PlatformSearchResponse } from '../../types/responses/search-response.model'
import { createMutableSchema } from '@empathyco/x-adapter'
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
export const searchResponseSchema = createMutableSchema<PlatformSearchResponse, SearchResponse>({
  results: {
    $path: 'catalog.content',
    $subSchema: resultSchema,
  },
  facets: {
    $path: 'catalog.facets',
    $subSchema: facetSchema,
  },
  totalResults: 'catalog.numFound',
  spellcheck: 'catalog.spellchecked',
  banners: {
    $path: 'banner.content',
    $subSchema: bannerSchema,
  },
  promoteds: {
    $path: 'promoted.content',
    $subSchema: promotedSchema,
  },
  redirections: {
    $path: 'direct.content',
    $subSchema: redirectionSchema,
  },
  partialResults: {
    $path: 'catalog.partials',
    $subSchema: partialResultsSchema,
  },
  stats: {
    $path: 'catalog.stats',
    $subSchema: statsSchema,
  },
  queryTagging: ({ catalog }) => getTaggingInfoFromUrl(catalog?.tagging?.query),
  displayTagging: ({ catalog }) => getDisplayTaggingInfoFromUrl(catalog?.tagging?.display),
})
