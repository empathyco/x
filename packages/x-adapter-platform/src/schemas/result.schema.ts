import { createMutableSchema, Schema } from '@empathyco/x-adapter-next';
import { Result } from '@empathyco/x-types';
import { Dictionary, extractUrlParameters } from '@empathyco/x-utils';
import { PlatformResult } from '../types';

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
  tagging: ({ tagging }) => {
    const mappedTagging: Dictionary = {};
    if (tagging) {
      Object.keys(tagging).forEach(key => {
        const url: string = tagging[key];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        mappedTagging[key] = extractUrlParameters(url);
      });
      return mappedTagging;
    } else {
      return {};
    }
  }
};

export const resultMutableSchema = createMutableSchema(resultSchema);
