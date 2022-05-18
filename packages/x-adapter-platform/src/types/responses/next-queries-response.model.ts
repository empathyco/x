import { PlatformNextQuery } from '../models.types';

export interface PlatformNextQueriesResponse {
  data: {
    nextqueries: PlatformNextQuery[];
  };
}
