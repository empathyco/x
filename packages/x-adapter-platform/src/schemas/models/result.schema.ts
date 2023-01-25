import { createMutableSchema } from '@empathyco/x-adapter';
import { Result } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '../../mappers/url.utils';
import { PlatformResult } from '../../types/models/result.model';

export const resultSchema = createMutableSchema<PlatformResult, Result>({
  id: '__id',
  images: '__images',
  name: '__name',
  url: '__url',
  identifier: {
    value: '__externalId'
  },
  rating: {
    value: () => null
  },
  price: {
    value: '__prices.current.value',
    originalValue: ({ __prices: rawPrices }) =>
      rawPrices.previous?.value ?? rawPrices.current.value,
    futureValue: ({ __prices: rawPrices }) => rawPrices.future?.value ?? rawPrices.current.value,
    hasDiscount: ({ __prices: rawPrices }) =>
      rawPrices.current.value < (rawPrices.previous?.value ?? rawPrices.current.value)
  },
  type: () => 'Default',
  modelName: () => 'Result',
  isWishlisted: () => false,
  tagging: {
    $path: 'tagging',
    $subSchema: {
      add2cart: ({ add2cart }) => getTaggingInfoFromUrl(add2cart),
      checkout: ({ checkout }) => getTaggingInfoFromUrl(checkout),
      click: ({ click }) => getTaggingInfoFromUrl(click)
    }
  }
});
