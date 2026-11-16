import type { Result } from '@empathyco/x-types'
import type { PlatformResultSource } from '../source.types'
import { defined } from '../utils'

/**
 * Maps the properties of the result that do not depend on the endpoint.
 *
 * @param source - The result that the Platform API returns.
 * @returns The result without its tagging.
 * @internal
 */
export function mapResult(source: PlatformResultSource): Omit<Result, 'tagging'> {
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
