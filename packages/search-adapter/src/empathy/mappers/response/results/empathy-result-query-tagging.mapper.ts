import { getSafePropertyChain } from '@empathy/get-safe-property-chain';
import { Result, Tagging } from '@empathy/search-types';
import { inject, injectable, multiInject } from 'inversify';
import { EmpathyAdapterConfig } from '../../../config/empathy-adapter-config.types';
import { DEPENDENCIES } from '../../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../../empathy-adapter.types';
import { Logger } from '../../../logger';
import { EmpathyResult } from '../../../models';
import { pipeMappers } from '../../pipe-mappers';

@injectable()
export class EmpathyResultQueryTaggingMapper implements ResponseMapper<EmpathyResult, Result> {
  private readonly logger = Logger.child('EmpathyResultQueryTaggingMapper');
  private readonly mapQueryTagging: MapFn<string, Tagging>;
  private readonly queryTrackingPath: string;

  constructor(
    @inject(DEPENDENCIES.config) config: EmpathyAdapterConfig,
    @multiInject(DEPENDENCIES.ResponseMappers.queryTagging) queryTaggingMappers: ResponseMapper<string, Tagging>[]
  ) {
    this.mapQueryTagging = pipeMappers(...queryTaggingMappers);
    this.queryTrackingPath = config.features.search.responsePaths.queryTagging;
  }

  map(_rawResult: EmpathyResult, result: Result, context: ResponseMapperContext): Result {
    Object.assign(result.tagging, { query: context.resultsQueryTagging || this.mapNewQueryTagging(context) });
    return result;
  }

  private mapNewQueryTagging(context: ResponseMapperContext): Tagging | null {
    const queryTagging: string = getSafePropertyChain<any>(context.rawResponse, this.queryTrackingPath);
    if (queryTagging) {
      return context.resultsQueryTagging = this.mapQueryTagging(queryTagging, {} as Tagging, context);
    }
    this.logger.warn(`Query tagging at path "${ this.queryTrackingPath }" not found when mapping for feature "${ context.feature }"`);
    return null;
  }
}
