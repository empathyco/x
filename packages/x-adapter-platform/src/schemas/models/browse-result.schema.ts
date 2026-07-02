import type { Result } from '@empathyco/x-types'
import type { PlatformResult } from '../../types/models/result.model'
import { createMutableSchema } from '@empathyco/x-adapter'
import { getDisplayTaggingInfoFromUrl, getTaggingInfoFromUrl } from '../../mappers/url.utils'

/**
 * Default implementation for the BrowseResultSchema.
 *
 * @public
 */
export const browseResultSchema = createMutableSchema<PlatformResult, Result>({
  id: '__id',
  images: '__images',
  name: '__name',
  url: '__url',
  identifier: {
    value: '__externalId',
  },
  rating: {
    value: () => null,
  },
  price: {
    value: ({ __prices: rawPrices }) => rawPrices.current?.value,
    originalValue: ({ __prices: rawPrices }) =>
      rawPrices.previous?.value ?? rawPrices.current?.value,
    hasDiscount: ({ __prices: rawPrices }) =>
      (rawPrices.current?.value ?? 0) <
      (rawPrices.previous?.value ?? rawPrices.current?.value ?? 0),
  },
  type: () => 'Default',
  modelName: () => 'Result',
  isWishlisted: () => false,
  tagging: {
    $path: 'tagging',
    $subSchema: {
      add2cart: ({ browseAdd2Cart }) => getTaggingInfoFromUrl(browseAdd2Cart),
      click: ({ browseProduct }) => getTaggingInfoFromUrl(browseProduct),
      checkout: ({ browseCheckout }) => getTaggingInfoFromUrl(browseCheckout),
      displayClick: ({ displayBrowseProduct }) =>
        getDisplayTaggingInfoFromUrl(displayBrowseProduct),
    },
  },
})
