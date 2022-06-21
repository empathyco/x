import { schemaMapperFactory } from '@empathyco/x-adapter';
import { TaggingRequest } from '@empathyco/x-types';
import { taggingRequestMutableSchema } from '../../schemas/requests/tagging-request.schema';

export const taggingRequestMapper = schemaMapperFactory<TaggingRequest, any>(
  taggingRequestMutableSchema
);
