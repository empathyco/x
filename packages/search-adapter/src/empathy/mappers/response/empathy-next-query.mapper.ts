import { NextQuery } from '@empathy/search-types';
import { injectable } from 'inversify';
import { ResponseMapper } from '../../empathy-adapter.types';
import { EmpathyNextQuery } from '../../models/entities/empathy-next-query.model';

@injectable()
export class EmpathyNextQueryMapper implements ResponseMapper<EmpathyNextQuery, NextQuery> {
  map(rawNextQuery: EmpathyNextQuery, nextQuery: NextQuery): NextQuery {
    return Object.assign(nextQuery, {
      id: rawNextQuery.query.replace(/\s+/g, '-').toLowerCase(),
      query: rawNextQuery.query,
      modelName: 'NextQuery',
      results: [],
      resultsFacets: {},
      numFound: 0
    });
  }
}
