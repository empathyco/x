import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { Banner, TaggingInfo } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformBanner } from '../types/models.types';

export const bannerSchema: Schema<PlatformBanner, Banner> = {
  id: 'id',
  title: 'title',
  url: 'url',
  image: 'image_url',
  modelName: () => 'Banner',
  tagging: {
    query: ({ tagging }) => getTaggingInfoFromUrl(tagging?.query ?? '') as TaggingInfo
  }
};

export const bannerMutableSchema = createMutableSchema(bannerSchema);
