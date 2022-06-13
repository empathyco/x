import { RelatedTag } from '@empathyco/x-types';
import { PlatformRelatedTag } from './models.types';

export interface RelatedTagsResponse {
  relatedTags: RelatedTag[];
}

export interface PlatformRelatedTagsResponse {
  data: {
    relatedtags: PlatformRelatedTag[];
  };
  status: number;
}
