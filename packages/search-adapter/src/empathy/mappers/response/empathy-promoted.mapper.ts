import { Promoted } from '@empathyco/x-types';
import { injectable, multiInject } from 'inversify';
import { TrackingRequest } from '../../../types/requests.types';
import { DEPENDENCIES } from '../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../empathy-adapter.types';
import { EmpathyPromoted } from '../../models';
import { pipeMappers } from '../pipe-mappers';

/**
 * TODO https://searchbroker.atlassian.net/browse/EX-2163
 *
 * @public
 */
@injectable()
export class EmpathyPromotedMapper implements ResponseMapper<EmpathyPromoted, Promoted> {
  private readonly mapTagging: MapFn<string, TrackingRequest>;

  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.queryTagging)
    taggingMappers: ResponseMapper<string, TrackingRequest>[]
  ) {
    this.mapTagging = pipeMappers(...taggingMappers);
  }

  map(rawPromoted: EmpathyPromoted, promoted: Promoted, context: ResponseMapperContext): Promoted {
    return Object.assign(promoted, {
      modelName: 'Promoted',
      id: rawPromoted.id,
      title: rawPromoted.title,
      url: rawPromoted.url,
      image: rawPromoted.imagename,
      tagging: {
        click: this.mapTagging(rawPromoted.trackable_url, {} as TrackingRequest, context)
      }
    });
  }
}
