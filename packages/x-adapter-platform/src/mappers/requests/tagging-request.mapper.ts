import { schemaMapperFactory } from '@empathyco/x-adapter-next';
import { TaggingRequest } from '../../types/request.types';
import { taggingRequestMutableSchema } from '../../schemas/requests/tagging-request.schema';

export const taggingRequestMapper = schemaMapperFactory<TaggingRequest, any>(
  taggingRequestMutableSchema
);
