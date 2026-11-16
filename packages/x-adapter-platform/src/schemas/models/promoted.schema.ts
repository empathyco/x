import type { Promoted } from '@empathyco/x-types'
import type { PlatformBannerSource } from '../source.types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { defined } from '../utils'

/**
 * Default implementation for the PromotedSchema.
 *
 * @public
 */
export const promotedSchema = createMutableZodSchema<PlatformBannerSource, Promoted>({
  transform: (source): Promoted => ({
    ...defined<Pick<Promoted, 'id' | 'title' | 'url' | 'image' | 'position'>>({
      id: source.id,
      title: source.title,
      url: source.url,
      image: source.image_url,
      position: source.position,
    }),
    modelName: 'Promoted',
    tagging: {
      click: getTaggingInfoFromUrl(source.tagging?.click ?? ''),
    },
  }),
})
