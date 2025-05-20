import type { MutableSchema } from '@empathyco/x-adapter'
import type { BrowseResponse, Result } from '@empathyco/x-types'
import type { PlatformTagging } from '../../types/index'
import type { PlatformResult } from '../../types/models/result.model'
import type { PlatformBrowseResponse } from '../../types/responses/browse-response.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/index'
import { facetSchema } from '../models/index'
import { resultSchema } from '../models/result.schema'

export const browseResultSchema: MutableSchema<PlatformResult, Result> = resultSchema.$extends({
  ...resultSchema,
  tagging: {
    $path: 'tagging',
    $subSchema: {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      click: ({ browseProduct }: PlatformTagging) => getTaggingInfoFromUrl(browseProduct),
    },
  },
})

export const browseResponseSchema = createMutableSchema<PlatformBrowseResponse, BrowseResponse>({
  results: {
    $path: 'catalog.content',
    $subSchema: browseResultSchema,
  },
  facets: {
    $path: 'catalog.facets',
    $subSchema: facetSchema,
  },
  totalResults: 'catalog.numFound',
  browseTagging: ({ catalog }) => getTaggingInfoFromUrl(catalog?.tagging?.browseCategory),
  displayTagging: ({ catalog }) =>
    getDisplayTaggingInfoFromUrl(catalog?.tagging?.displayBrowseCategory),
})
