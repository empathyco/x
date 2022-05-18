import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { TaggingRequest } from '@empathyco/x-types';
import { taggingRequestMutableSchema } from '../../schemas/request/tagging-request.schema';

export const taggingRequestMapper = schemaMapperFactory<TaggingRequest, any>(
  taggingRequestMutableSchema
);
