import type { Banner } from '@empathyco/x-types'
import { z } from 'zod'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'

/**
 * Default implementation for the BannerSchema.
 *
 * @public
 */
export const bannerSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().optional(),
    url: z.string().optional(),
    image_url: z.string().optional(),
    position: z.number().optional(),
    tagging: z
      .object({
        click: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): Banner => ({
      id: source.id ?? '',
      title: source.title ?? '',
      url: source.url ?? '',
      image: source.image_url ?? '',
      position: source.position,
      modelName: 'Banner',
      tagging: {
        click: getTaggingInfoFromUrl(source.tagging?.click ?? ''),
      },
    }),
  )
