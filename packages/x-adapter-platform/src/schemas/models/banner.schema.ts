import type { Banner } from '@empathyco/x-types'
import type { PlatformBannerSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { defined } from '../utils'

/**
 * Default implementation for the BannerSchema.
 *
 * @public
 */
export const bannerSchema = createMutableZodSchema<PlatformBannerSource, Banner>({
  transform: (source): Banner => ({
    ...defined<Pick<Banner, 'id' | 'title' | 'url' | 'image' | 'position'>>({
      id: source.id,
      title: source.title,
      url: source.url,
      image: source.image_url,
      position: source.position,
    }),
    modelName: 'Banner',
    tagging: {
      click: getTaggingInfoFromUrl(source.tagging?.click ?? ''),
    },
  }),
})
