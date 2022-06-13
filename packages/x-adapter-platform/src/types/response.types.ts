import { NextQuery, RelatedTag, Result } from '@empathyco/x-types';
import { PlatformRelatedTag } from './models.types';
import { PlatformResult } from './models/result.model';
import { PlatformNextQuery } from './models/next-query.model';

export interface PlatformTopClickedResponse {
  topclicked: {
    content: PlatformResult[];
    numFound: number;
  };
}

export interface TopClickedResponse {
  results: Result[];
}

export interface NextQueriesResponse {
  nextQueries: NextQuery[];
}

export interface PlatformNextQueriesResponse {
  data: {
    nextqueries: PlatformNextQuery[];
  };
}

export interface RelatedTagsResponse {
  relatedTags: RelatedTag[];
}

export interface PlatformRelatedTagsResponse {
  data: {
    relatedtags: PlatformRelatedTag[];
  };
  status: number;
}
