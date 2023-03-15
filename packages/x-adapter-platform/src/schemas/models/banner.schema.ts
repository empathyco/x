import { createMutableSchema } from '@empathyco/x-adapter';
import { Banner } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '../../mappers/url.utils';
import { PlatformBanner } from '../../types/models/banner.model';

/**
 * Default implementation for the BannerSchema.
 *
 * @public
 */
export const bannerSchema = createMutableSchema<PlatformBanner, Banner>({
  id: 'id',
  title: 'title',
  url: 'url',
  image: 'image_url',
  position: 'position',
  modelName: () => 'Banner',
  tagging: {
    query: ({ tagging }) => getTaggingInfoFromUrl(tagging?.query ?? ''),
    click: ({ tagging }) => getTaggingInfoFromUrl(tagging?.click ?? '')
  }
});
