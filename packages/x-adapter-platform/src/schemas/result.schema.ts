import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { Result, Tagging } from '@empathyco/x-types';
import { extractUrlParameters } from '@empathyco/x-utils';
import { PlatformResult, PlatformTagging } from '../types';

export const resultTaggingSchema: Schema<PlatformTagging, Tagging> = {
  add2cart: ({ add2cart }) => extractUrlParameters(add2cart),
  checkout: ({ checkout }) => extractUrlParameters(checkout),
  click: ({ click }) => extractUrlParameters(click)
};

export const resultTaggingMutableSchema = createMutableSchema(resultTaggingSchema);

export const resultSchema: Schema<PlatformResult, Result> = {
  id: 'id',
  images: 'images',
  name: 'name',
  url: 'url',
  identifier: {
    value: 'sku'
  },
  rating: {
    value: ({ averageRating }) => Number(averageRating)
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
