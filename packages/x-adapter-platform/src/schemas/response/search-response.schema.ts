import { Schema, createMutableSchema } from '@empathyco/x-adapter-next';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { SearchResponse } from '@empathyco/x-types';
import { PlatformSearchResponse } from '../../types/responses/search-response.model';
import { bannerMutableSchema } from './models/banner.schema';
import { facetMutableSchema } from './models/facet.schema';
import { promotedMutableSchema } from './models/promoted.schema';
import { redirectionMutableSchema } from './models/redirection.schema';
import { resultMutableSchema } from './models/result.schema';

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

export const searchResponseMutableSchema = createMutableSchema(searchResponseSchema);
