import { NextQuery } from '@empathy/search-types';
import { injectable } from 'inversify';
import { ResponseMapper } from '../../empathy-adapter.types';
import { EmpathyNextQuery } from '../../models/entities/empathy-next-query.model';

@injectable()
export class EmpathyNextQueryMapper implements ResponseMapper<EmpathyNextQuery, NextQuery> {
  map(rawNextQuery: EmpathyNextQuery, nextQuery: NextQuery): NextQuery {
    return Object.assign(nextQuery, {
      modelName: 'NextQuery',
      query: rawNextQuery.query,
      results: [],
      facets: [],
      totalResults: 0
    });
  }
}
