import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { TaggingRequest } from '@empathyco/x-types';

export const taggingRequestMutableSchema = createMutableSchema<Schema<TaggingRequest, any>>({});
