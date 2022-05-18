import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { TaggingRequest } from '@empathyco/x-types';

export const taggingRequestSchema: Schema<TaggingRequest, any> = {};

export const taggingRequestMutableSchema = createMutableSchema(taggingRequestSchema);
