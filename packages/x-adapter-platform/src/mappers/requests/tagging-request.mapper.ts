import { createMutableSchema, Schema, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { TaggingRequest } from '../../types/request.types';

export const taggingRequestSchema: Schema<TaggingRequest, any> = {};

export const taggingRequestMutableSchema = createMutableSchema(taggingRequestSchema);

export const taggingRequestMapper = schemaMapperFactory<TaggingRequest, any>(
  taggingRequestMutableSchema
);
