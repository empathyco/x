import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { Banner, TaggingInfo } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformBannerItem } from '../types';

export const bannerSchema: Schema<PlatformBannerItem, Banner> = {
  id: 'id',
  modelName: () => 'Banner',
  title: 'title',
  url: 'url',
  image: 'image_url',
  tagging: {
    query: ({ tagging }) => getTaggingInfoFromUrl(tagging?.query ?? '') as TaggingInfo
  }
};

export const bannerMutableSchema = createMutableSchema(bannerSchema);
