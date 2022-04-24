import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { TaggingInfo } from '@empathyco/x-types';
import { PlatformSearchResponse, SearchResponse } from '../../types';
import { resultMutableSchema } from '../../schemas';
import { facetSchema } from '../../schemas/facet.schema';

export const searchResponseSchema: Schema<PlatformSearchResponse, SearchResponse> = {
  results: {
    $path: 'catalog.content',
    $subSchema: resultMutableSchema
  },
  facets: {
    $path: 'catalog.facets',
    $subSchema: facetSchema
  },
  totalResults: 'catalog.numFound',
  spellcheck: 'catalog.spellchecked',
  banners: 'banner.content',
  promoteds: 'promoted.content',
  redirections: 'direct.content',
  queryTagging: ({ catalog }) => getTaggingInfoFromUrl(catalog?.tagging?.query) as TaggingInfo
};

export const mutableSearchResponseSchema = createMutableSchema(searchResponseSchema);

export const searchResponseMapper = schemaMapperFactory<PlatformSearchResponse, SearchResponse>(
  mutableSearchResponseSchema
);
