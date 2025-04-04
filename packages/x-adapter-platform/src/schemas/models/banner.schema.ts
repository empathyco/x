import type { Banner } from '@empathyco/x-types'
import type { PlatformBanner } from '../../types/models/banner.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'

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
    click: ({ tagging }) => getTaggingInfoFromUrl(tagging?.click ?? ''),
  },
})
