import type { Redirection } from '@empathyco/x-types'
import { z } from 'zod'
import { getTaggingInfoFromUrl } from '../../mappers/url.utils'

/**
 * Default implementation for the RedirectionSchema.
 *
 * @public
 */
export const redirectionSchema = z
  .object({
    id: z.string().optional(),
    url: z.string().optional(),
    tagging: z
      .object({
        click: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): Redirection => ({
      id: source.id ?? '',
      url: source.url ?? '',
      modelName: 'Redirection',
      tagging: {
        click: getTaggingInfoFromUrl(source.tagging?.click ?? ''),
      },
    }),
  )
