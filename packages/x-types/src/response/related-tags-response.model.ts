import { RelatedTag } from '../query-signals';

/**
 * Response for the related tags endpoint.
 *
 * @public
 */
export interface RelatedTagsResponse {
  relatedTags: RelatedTag[];
}
