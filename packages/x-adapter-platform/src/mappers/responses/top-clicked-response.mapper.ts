import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { PlatformTopClickedResponse, TopClickedResponse } from '../../types/response.types';
import { resultSchema } from '../../schemas/models/result.schema';

export const topClickedResponseSchema: Schema<PlatformTopClickedResponse, TopClickedResponse> = {
  results: {
    $path: 'topclicked.content',
    $subSchema: resultSchema
  }
};

export const topClickedResponseMutableSchema = createMutableSchema(topClickedResponseSchema);

export const topClickedResponseMapper = schemaMapperFactory<
  PlatformTopClickedResponse,
  TopClickedResponse
>(topClickedResponseMutableSchema);
