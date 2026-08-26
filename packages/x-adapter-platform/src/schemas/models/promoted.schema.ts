import type { Promoted } from '@empathyco/x-types'
import { z } from 'zod'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'

/**
 * Default implementation for the PromotedSchema.
 *
 * @public
 */
export const promotedSchema = z
  .object({
    id: z.string().optional(),
    url: z.string().optional(),
    title: z.string().optional(),
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
    (source): Promoted => ({
      id: source.id ?? '',
      url: source.url ?? '',
      title: source.title ?? '',
      image: source.image_url ?? '',
      position: source.position,
      modelName: 'Promoted',
      tagging: {
        click: getTaggingInfoFromUrl(source.tagging?.click ?? ''),
      },
    }),
  )
