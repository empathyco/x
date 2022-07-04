import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { SearchResponse } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '../../mappers/url.utils';
import { PlatformSearchResponse } from '../../types/responses/search-response.model';
import { bannerSchema } from '../models/banner.schema';
import { facetSchema } from '../models/facet.schema';
import { promotedSchema } from '../models/promoted.schema';
import { redirectionSchema } from '../models/redirection.schema';
import { resultSchema } from '../models/result.schema';
import { partialResultsSchema } from '../models/partial-results.schema';

export const searchResponseSchema = createMutableSchema<
  Schema<PlatformSearchResponse, SearchResponse>
>({
  results: {
    $path: 'catalog.content',
    $subSchema: resultSchema
  },
  facets: {
    $path: 'catalog.facets',
    $subSchema: facetSchema
  },
  totalResults: 'catalog.numFound',
  spellcheck: 'catalog.spellchecked',
  banners: {
    $path: 'banner.content',
    $subSchema: bannerSchema
  },
  promoteds: {
    $path: 'promoted.content',
    $subSchema: promotedSchema
  },
  redirections: {
    $path: 'direct.content',
    $subSchema: redirectionSchema
  },
  partialResults: {
    $path: 'catalog.partials',
    $subSchema: partialResultsSchema
  },
  queryTagging: ({ catalog }) => getTaggingInfoFromUrl(catalog?.tagging?.query)
});
