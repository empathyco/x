import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { extractUrlParameters } from '@empathyco/x-utils';
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  queryTagging: ({ catalog }) => extractUrlParameters(catalog.tagging.query)
};

export const mutableSearchResponseSchema = createMutableSchema(searchResponseSchema);

export const searchResponseMapper = schemaMapperFactory<PlatformSearchResponse, SearchResponse>(
  mutableSearchResponseSchema
);
