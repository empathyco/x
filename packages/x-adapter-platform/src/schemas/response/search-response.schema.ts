import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { Schema, createMutableSchema } from '@empathyco/x-adapter-next';
import { SearchResponse } from '@empathyco/x-types';
import { PlatformSearchResponse } from '../../types/responses/search-response.model';
import { resultMutableSchema } from '../result.schema';
import { facetMutableSchema } from '../facet.schema';
import { bannerMutableSchema } from '../banner.schema';
import { promotedMutableSchema } from '../promoted.schema';
import { redirectionMutableSchema } from '../redirection.schema';

export const searchResponseSchema: Schema<PlatformSearchResponse, SearchResponse> = {
  results: {
    $path: 'catalog.content',
    $subSchema: resultMutableSchema
  },
  facets: {
    $path: 'catalog.facets',
    $subSchema: facetMutableSchema
  },
  totalResults: 'catalog.numFound',
  spellcheck: 'catalog.spellchecked',
  banners: {
    $path: 'banner.content',
    $subSchema: bannerMutableSchema
  },
  promoteds: {
    $path: 'promoted.content',
    $subSchema: promotedMutableSchema
  },
  redirections: {
    $path: 'direct.content',
    $subSchema: redirectionMutableSchema
  },
  queryTagging: ({ catalog }) => getTaggingInfoFromUrl(catalog?.tagging?.query)
};

export const mutableSearchResponseSchema = createMutableSchema(searchResponseSchema);
