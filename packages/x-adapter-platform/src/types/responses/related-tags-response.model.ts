import { PlatformRelatedTag } from '../models/related-tag.model';

/**
 * Response for the `related tags` endpoint.
 *
 * @public
 */
export interface PlatformRelatedTagsResponse {
  data: {
    relatedtags: PlatformRelatedTag[];
  };
  status: number;
}
