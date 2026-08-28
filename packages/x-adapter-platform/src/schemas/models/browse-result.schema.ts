import type { Result } from '@empathyco/x-types'
import { z } from 'zod'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'

/**
 * Default implementation for the BrowseResultSchema.
 *
 * @public
 */
export const browseResultSchema = z
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
        browseAdd2Cart: z.string().optional(),
        browseProduct: z.string().optional(),
        browseCheckout: z.string().optional(),
        displayBrowseProduct: z.string().optional(),
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
      url: source.__url,
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
        add2cart: getTaggingInfoFromUrl(source.tagging?.browseAdd2Cart ?? ''),
        checkout: getTaggingInfoFromUrl(source.tagging?.browseCheckout ?? ''),
        click: getTaggingInfoFromUrl(source.tagging?.browseProduct ?? ''),
        displayClick: getDisplayTaggingInfoFromUrl(source.tagging?.displayBrowseProduct ?? ''),
      },
    }),
  )
