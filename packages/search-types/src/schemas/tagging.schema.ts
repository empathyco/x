import { Taggable, Tagging, TaggingInfo } from '../tagging.model';

/**
 * Jest schema for validating TaggingInfo entities.
 *
 * @public
 */
export const TaggingInfoSchema: TaggingInfo = {
  params: expect.any(Object),
  url: expect.any(String)
};

/**
 * Jest schema for validating Tagging entities.
 *
 * @public
 */
export const TaggingSchema: Tagging = {
  add2cart: TaggingInfoSchema,
  checkout: TaggingInfoSchema,
  click: TaggingInfoSchema,
  query: TaggingInfoSchema
};

/**
 * Jest schema for validating Taggable entities.
 *
 * @public
 */
export const TaggableSchema: Taggable = {
  tagging: TaggingSchema
};
