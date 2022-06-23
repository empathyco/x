import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { Banner } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '../../mappers/url.util';
import { PlatformBanner } from '../../types/models/banner.model';

export const bannerMutableSchema = createMutableSchema<Schema<PlatformBanner, Banner>>({
  id: 'id',
  title: 'title',
  url: 'url',
  image: 'image_url',
  modelName: () => 'Banner',
  tagging: {
    query: ({ tagging }) => getTaggingInfoFromUrl(tagging?.query ?? '')
  }
});
