import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { PlatformTopClickedResponse, TopClickedResponse } from '../../types/response.types';
import { resultMutableSchema } from '../../schemas/models/result.schema';

export const topClickedResponseSchema: Schema<PlatformTopClickedResponse, TopClickedResponse> = {
  results: {
    $path: 'topclicked.content',
    $subSchema: resultMutableSchema
  }
};

export const topClickedResponseMutableSchema = createMutableSchema(topClickedResponseSchema);

export const topClickedResponseMapper = schemaMapperFactory<
  PlatformTopClickedResponse,
  TopClickedResponse
>(topClickedResponseMutableSchema);
