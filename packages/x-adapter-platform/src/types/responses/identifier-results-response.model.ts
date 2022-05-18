import { PlatformResult } from '../models.types';

export interface PlatformIdentifierResultsResponse {
  catalog: {
    content: PlatformResult[];
    tagging: {
      query: string;
    };
  };
}
