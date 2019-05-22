import { RelatedTag } from '../../query-signals/related-tag.model';

export const RelatedTagSchema: RelatedTag = {
  previous: expect.any(String),
  query: expect.any(String),
  selected: expect.any(Boolean),
  tag: expect.any(String)
};
