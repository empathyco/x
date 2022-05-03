import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { Result, Tagging, TaggingInfo } from '@empathyco/x-types';
import { getTaggingInfoFromUrl } from '@empathyco/x-utils';
import { PlatformResult, PlatformTagging } from '../types/models.types';

export const resultTaggingSchema: Schema<PlatformTagging, Tagging> = {
  add2cart: ({ add2cart }) => getTaggingInfoFromUrl(add2cart) as TaggingInfo,
  checkout: ({ checkout }) => getTaggingInfoFromUrl(checkout) as TaggingInfo,
  click: ({ click }) => getTaggingInfoFromUrl(click) as TaggingInfo
};

export const resultTaggingMutableSchema = createMutableSchema(resultTaggingSchema);

export const resultSchema: Schema<PlatformResult, Result> = {
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
    value: ({ averageRating }) => {
      return averageRating ? Number(averageRating) : null;
    }
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
    $subSchema: resultTaggingMutableSchema
  }
};

export const resultMutableSchema = createMutableSchema(resultSchema);
