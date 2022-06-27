import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { Banner } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '../../mappers/url.utils';
import { PlatformBanner } from '../../types/models/banner.model';

export const bannerSchema = createMutableSchema<Schema<PlatformBanner, Banner>>({
  id: 'id',
  title: 'title',
  url: 'url',
  image: 'image_url',
  modelName: () => 'Banner',
  tagging: {
    query: ({ tagging }) => getTaggingInfoFromUrl(tagging?.query ?? '')
  }
});
