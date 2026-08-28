import type { Result } from '@empathyco/x-types'
import { z } from 'zod'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'

/**
 * Default implementation for the ResultSchema.
 *
 * @public
 */
export const resultSchema = z
  .object({
    __id: z.string().optional(),
    __images: z.array(z.string()).optional(),
    __name: z.string().optional(),
    __url: z.string().optional(),
    __externalId: z.string().optional(),
    __prices: z
      .object({
        current: z.object({ value: z.number().optional() }).passthrough().optional(),
        previous: z.object({ value: z.number().optional() }).passthrough().optional(),
      })
      .passthrough()
      .optional(),
    tagging: z
      .object({
        add2cart: z.string().optional(),
        checkout: z.string().optional(),
        click: z.string().optional(),
        displayClick: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()
  .transform(
    (source): Result => ({
      id: source.__id ?? '',
      images: source.__images,
      name: source.__name,
      ...(source.__url ? { url: source.__url } : {}),
      identifier: {
        value: source.__externalId ?? '',
      },
      rating: {
        value: null,
      },
      price: {
        value: source.__prices?.current?.value,
        originalValue: source.__prices?.previous?.value ?? source.__prices?.current?.value,
        hasDiscount:
          (source.__prices?.current?.value ?? 0) <
          (source.__prices?.previous?.value ?? source.__prices?.current?.value ?? 0),
      },
      type: 'Default',
      modelName: 'Result',
      isWishlisted: false,
      tagging: {
        add2cart: getTaggingInfoFromUrl(source.tagging?.add2cart ?? ''),
        checkout: getTaggingInfoFromUrl(source.tagging?.checkout ?? ''),
        click: getTaggingInfoFromUrl(source.tagging?.click ?? ''),
        displayClick: getDisplayTaggingInfoFromUrl(source.tagging?.displayClick ?? ''),
      },
    }),
  )
