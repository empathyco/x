import { PlatformSemanticQuery } from '../models';

export interface PlatformSemanticQueriesResponse {
  data: {
    candidates: PlatformSemanticQuery[];
  };
}
