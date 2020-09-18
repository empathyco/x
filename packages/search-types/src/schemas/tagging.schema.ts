import { Tagging } from '../tagging.model';

/**
 * Jest schema for validating Tagging entities.
 *
 * @public
 */
export const TaggingSchema: Tagging = {
  params: expect.any(Object),
  url: expect.any(String)
};
