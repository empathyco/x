import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { PlatformSearchResponse, SearchResponse } from '../../types';

const searchResponseSchema: Schema<PlatformSearchResponse, SearchResponse> = {
  results: 'catalog.content',
  facets: 'catalog.facets',
  totalResults: 'catalog.numFound',
  spellcheck: 'catalog.spellchecked',
  banners: 'banner.content',
  promoteds: 'promoted.content',
  redirections: 'direct.content',
  queryTagging: 'catalog.tagging.query'
};

export const mutableSearchResponseSchema = createMutableSchema(searchResponseSchema);

export const searchResponseMapper = schemaMapperFactory<PlatformSearchResponse, any>(
  mutableSearchResponseSchema
);
