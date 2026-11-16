import type { Promoted } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { defined } from '../utils'

/**
 * Default implementation for the PromotedSchema.
 *
 * @public
 */
export const promotedSchema = createMutableZodSchema({
  source: z.looseObject({
    id: z.string(),
    title: z.optional(z.string()),
    url: z.optional(z.string()),
    image_url: z.optional(z.string()),
    position: z.optional(z.number()),
    tagging: z.optional(z.looseObject({ click: z.optional(z.string()) })),
  }),
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
