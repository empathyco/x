import { RelatedTag } from '../query-signals/related-tag.model';

/**
 * @public
 * Jest schema for validating Related Tag entities
 */
export const RelatedTagSchema: RelatedTag = {
  modelName: expect.any(String),
  query: expect.any(String),
  previous: expect.any(String),
  selected: expect.any(Boolean),
  tag: expect.any(String)
};
