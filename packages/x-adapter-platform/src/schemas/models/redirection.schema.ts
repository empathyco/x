import type { Redirection } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'
import { defined } from '../utils'

/**
 * Default implementation for the RedirectionSchema.
 *
 * @public
 */
export const redirectionSchema = createMutableZodSchema({
  source: z.looseObject({
    id: z.string(),
    url: z.string(),
    tagging: z.optional(z.looseObject({ click: z.optional(z.string()) })),
  }),
  transform: (source): Redirection => ({
    ...defined<Pick<Redirection, 'id' | 'url'>>({ id: source.id, url: source.url }),
    modelName: 'Redirection',
    tagging: {
      click: getTaggingInfoFromUrl(source.tagging?.click ?? ''),
    },
  }),
})
