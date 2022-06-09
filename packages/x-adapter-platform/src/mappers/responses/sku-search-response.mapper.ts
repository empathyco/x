import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { PlatformSkuSearchResponse, SkuSearchResponse } from '../../types/response.types';
import { resultMutableSchema } from '../../schemas/result.schema';

export const skuSearchResponseSchema: Schema<PlatformSkuSearchResponse, SkuSearchResponse> = {
  results: {
    $path: 'catalog.content',
    $subSchema: resultMutableSchema
  }
};

export const skuSearchResponseMutableSchema = createMutableSchema(skuSearchResponseSchema);

export const skuSearchResponseMapper = schemaMapperFactory<
  PlatformSkuSearchResponse,
  SkuSearchResponse
>(skuSearchResponseMutableSchema);
