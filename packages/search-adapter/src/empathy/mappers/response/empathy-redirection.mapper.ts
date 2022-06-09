import { Redirection } from '@empathyco/x-types';
import { injectable, multiInject } from 'inversify';
import { TrackingRequest } from '../../../types/requests.types';
import { DEPENDENCIES } from '../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../empathy-adapter.types';
import { EmpathyDirect } from '../../models/entities/empathy-direct.model';
import { pipeMappers } from '../pipe-mappers';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyRedirectionMapper implements ResponseMapper<EmpathyDirect, Redirection> {
  private readonly mapTagging: MapFn<string, TrackingRequest>;

  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.queryTagging)
    taggingMappers: ResponseMapper<string, TrackingRequest>[]
  ) {
    this.mapTagging = pipeMappers(...taggingMappers);
  }

  map(
    rawDirect: EmpathyDirect,
    redirection: Redirection,
    context: ResponseMapperContext
  ): Redirection {
    return Object.assign<Redirection, Partial<Redirection>>(redirection, {
      modelName: 'Redirection',
      id: rawDirect.id,
      url: rawDirect.url,
      tagging: {
        click: this.mapTagging(rawDirect.trackable_url, {} as TrackingRequest, context)
      }
    });
  }
}
