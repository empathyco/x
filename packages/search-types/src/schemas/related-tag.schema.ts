import { RelatedTag } from '../query-signals/related-tag.model';

/**
 * Jest schema for validating Related Tag entities.
 *
 * @public
 */
export const RelatedTagSchema: RelatedTag = {
  isCurated: expect.undefinedOr(Boolean),
  modelName: expect.any(String),
  query: expect.any(String),
  previous: expect.any(String),
  selected: expect.any(Boolean),
  tag: expect.any(String)
};
