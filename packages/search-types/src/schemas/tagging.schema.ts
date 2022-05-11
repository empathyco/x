import { TaggingRequest } from '../request/tagging-request.model';
import { Taggable, Tagging } from '../tagging.model';

/**
 * Jest schema for validating TaggingRequest entities.
 *
 * @public
 */
export const TaggingRequestSchema: TaggingRequest = {
  params: expect.any(Object),
  url: expect.any(String)
};

/**
 * Jest schema for validating Tagging entities.
 *
 * @public
 */
export const TaggingSchema: Tagging = {
  add2cart: TaggingRequestSchema,
  checkout: TaggingRequestSchema,
  click: TaggingRequestSchema,
  query: TaggingRequestSchema
};

/**
 * Jest schema for validating Taggable entities.
 *
 * @public
 */
export const TaggableSchema: Taggable = {
  tagging: TaggingSchema
};
