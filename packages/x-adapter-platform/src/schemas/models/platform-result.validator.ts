import type { Result } from '@empathyco/x-types'
import * as z from 'zod/mini'
import { defined } from '../utils'

const price = z.optional(z.looseObject({ value: z.number() }))

/**
 * Validator of the result that the Platform API returns.
 *
 * @internal
 */
export const platformResultValidator = z.looseObject({
  __id: z.string(),
  __externalId: z.optional(z.string()),
  __name: z.optional(z.string()),
  __url: z.optional(z.string()),
  __images: z.optional(z.array(z.string())),
  __prices: z.optional(z.looseObject({ current: price, previous: price, future: price })),
  tagging: z.optional(
    z.looseObject({
      add2cart: z.optional(z.string()),
      checkout: z.optional(z.string()),
      click: z.optional(z.string()),
      displayClick: z.optional(z.string()),
      browseAdd2Cart: z.optional(z.string()),
      browseProduct: z.optional(z.string()),
      browseCheckout: z.optional(z.string()),
      displayBrowseProduct: z.optional(z.string()),
    }),
  ),
})

/**
 * Maps the properties of the result that do not depend on the endpoint.
 *
 * @param source - The result that the Platform API returns.
 * @returns The result without its tagging.
 * @internal
 */
export function mapResult(
  source: z.infer<typeof platformResultValidator>,
): Omit<Result, 'tagging'> {
  const current = source.__prices?.current?.value
  const previous = source.__prices?.previous?.value
  return {
    ...defined<Pick<Result, 'id' | 'images' | 'name' | 'url'>>({
      id: source.__id,
      images: source.__images,
      name: source.__name,
      url: source.__url,
    }),
    identifier: defined<NonNullable<Result['identifier']>>({ value: source.__externalId }),
    rating: { value: null },
    price: {
      value: current,
      originalValue: previous ?? current,
      hasDiscount: (current ?? 0) < (previous ?? current ?? 0),
    } as Result['price'],
    type: 'Default',
    modelName: 'Result',
    isWishlisted: false,
  }
}
