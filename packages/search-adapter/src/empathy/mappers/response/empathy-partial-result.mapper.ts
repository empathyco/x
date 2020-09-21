import { PartialResult, Result } from '@empathy/search-types';
import { injectable, multiInject } from 'inversify';
import { DEPENDENCIES } from '../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../empathy-adapter.types';
import { EmpathyPartialResult, EmpathyResult } from '../../models';
import { pipeMappers } from '../pipe-mappers';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyPartialResultMapper implements ResponseMapper<EmpathyPartialResult, PartialResult> {
  private readonly mapResult: MapFn<EmpathyResult, Result>;

  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.results) resultMappers: ResponseMapper<EmpathyResult, Result>[]
  ) {
    this.mapResult = pipeMappers(...resultMappers);
  }

  map(rawPartialResult: EmpathyPartialResult, partialResult: PartialResult, context: ResponseMapperContext): PartialResult {
    return Object.assign(partialResult, {
      query: rawPartialResult.suggestion,
      totalResults: rawPartialResult.numFound,
      results: rawPartialResult.docs.map(rawResult => this.mapResult(rawResult, {} as Result, context))
    });
  }
}
