import { createMutableSchema, Schema } from '@empathyco/x-adapter';
import { Result } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '../../mappers/url.utils';
import { PlatformResult } from '../../types/models/result.model';

export const resultSchema = createMutableSchema<Schema<PlatformResult, Result>>({
  id: 'id',
  images: ({ image }) => {
    return image ? [image] : [];
  },
  name: 'name',
  url: 'url',
  identifier: {
    value: 'id'
  },
  rating: {
    value: () => null
  },
  price: {
    value: 'price',
    originalValue: 'price',
    hasDiscount: () => false
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
