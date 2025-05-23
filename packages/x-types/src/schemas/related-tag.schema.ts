import type { RelatedTag } from '../query-signals/related-tag.model'

/**
 * Jest schema for validating Related Tag entities.
 *
 * @public
 */
export const RelatedTagSchema: RelatedTag = {
  isCurated: expect.undefinedOr(Boolean),
  modelName: expect.any(String),
  query: expect.any(String),
  tag: expect.any(String),
}
