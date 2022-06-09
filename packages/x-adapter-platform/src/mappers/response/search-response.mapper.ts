import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformSearchResponse, SearchResponse } from '../../types/response.types';
import { resultMutableSchema } from '../../schemas/result.schema';
import { facetMutableSchema } from '../../schemas/facet.schema';
import { promotedMutableSchema } from '../../schemas/promoted.schema';
import { bannerMutableSchema } from '../../schemas/banner.schema';
import { redirectionMutableSchema } from '../../schemas/redirection.schema';

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
  promoted: {
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

export const searchResponseMapper = schemaMapperFactory<PlatformSearchResponse, SearchResponse>(
  mutableSearchResponseSchema
);
