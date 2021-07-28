import { NextQuery } from '@empathyco/x-types-old';
import { injectable } from 'inversify';
import { ResponseMapper } from '../../empathy-adapter.types';
import { EmpathyNextQuery } from '../../models/entities/empathy-next-query.model';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
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
