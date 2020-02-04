import { Tagging } from '../tagging.model';

/**
 * @public
 * Jest schema for validating Tagging entities
 */
export const TaggingSchema: Tagging = {
  params: expect.any(Object),
  url: expect.any(String)
};
