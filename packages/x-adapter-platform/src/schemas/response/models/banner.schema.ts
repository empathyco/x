import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { Banner } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformBanner } from '../../../types/responses/models/banner.model';

export const bannerSchema: Schema<PlatformBanner, Banner> = {
  id: 'id',
  title: 'title',
  url: 'url',
  image: 'image_url',
  modelName: () => 'Banner',
  tagging: {
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
    query: ({ tagging }) =>
      tagging?.query ? getTaggingInfoFromUrl(tagging.query) : { url: '', params: {} }
  }
};

export const bannerMutableSchema = createMutableSchema(bannerSchema);
