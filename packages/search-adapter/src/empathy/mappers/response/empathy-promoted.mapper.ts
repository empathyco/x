import { Promoted, Tagging } from '@empathy/search-types';
import { injectable, multiInject } from 'inversify';
import { DEPENDENCIES } from '../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../empathy-adapter.types';
import { EmpathyPromoted } from '../../models';
import { pipeMappers } from '../pipe-mappers';

@injectable()
export class EmpathyPromotedMapper implements ResponseMapper<EmpathyPromoted, Promoted> {
  private readonly mapTagging: MapFn<string, Tagging>;

  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.queryTagging) taggingMappers: ResponseMapper<string, Tagging>[]
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
        click: this.mapTagging(rawPromoted.trackable_url, {} as Tagging, context)
      }
    });
  }
}
