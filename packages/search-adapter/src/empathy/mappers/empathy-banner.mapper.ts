import { Banner } from '@empathy/search-types';
import { injectable } from 'inversify';
import { Mapper } from '../empathy-adapter.types';
import { EmpathyBanner } from '../models/empathy-banner.model';

@injectable()
export class EmpathyBannerMapper implements Mapper<EmpathyBanner, Banner> {
  map(rawBanner: EmpathyBanner): Banner {
    return {
      modelName: 'Banner',
      id: rawBanner.id,
      title: rawBanner.title,
      url: rawBanner.url,
      image: rawBanner.imagename
    };
  }
}
