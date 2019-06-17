import { Banner, Tagging } from '@empathy/search-types';
import { injectable, multiInject } from 'inversify';
import { DEPENDENCIES } from '../../container/container.const';
import { MapFn, ResponseMapper, ResponseMapperContext } from '../../empathy-adapter.types';
import { EmpathyBanner } from '../../models/entities/empathy-banner.model';
import { pipeMappers } from '../pipe-mappers';

@injectable()
export class EmpathyBannerMapper implements ResponseMapper<EmpathyBanner, Banner> {
  private readonly mapTagging: MapFn<string, Tagging>;

  constructor(
    @multiInject(DEPENDENCIES.ResponseMappers.queryTagging) taggingMappers: ResponseMapper<string, Tagging>[]
  ) {
    this.mapTagging = pipeMappers(...taggingMappers);
  }

  map(rawBanner: EmpathyBanner, banner: Banner, context: ResponseMapperContext): Banner {
    return Object.assign(banner, {
      modelName: 'Banner',
      id: rawBanner.id,
      title: rawBanner.title,
      url: rawBanner.url,
      image: rawBanner.imagename,
      tagging: {
        click: this.mapTagging(rawBanner.trackable_url, {} as Tagging, context)
      }
    });
  }
}
