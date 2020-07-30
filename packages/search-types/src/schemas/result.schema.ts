import { Result } from '../result/result.model';
import { TaggingSchema } from './tagging.schema';

/**
 * @public
 * Jest schema for validating Result entities
 */
export const ResultSchema: Result = {
  callbackInfo: expect.any(Object),
  id: expect.any(String),
  identifier: {
    value: expect.any(String)
  },
  images: expect.arrayOf(String),
  modelName: expect.any(String),
  name: expect.any(String),
  price: {
    originalValue: expect.any(Number),
    value: expect.any(Number),
    hasDiscount: expect.any(Boolean)
  },
  rating: {
    value: expect.nullOr(Number)
  },
  tagging: {
    query: TaggingSchema,
    click: TaggingSchema,
    add2cart: TaggingSchema,
    checkout: TaggingSchema
  },
  type: expect.any(String),
  url: expect.any(String),
  isWishlisted: expect.any(Boolean)
};

/**
 * @public
 * Jest schema for validating Recommendation (AKA Result) entities
 */
export const RecommendationSchema: Result = {
  callbackInfo: expect.any(Object),
  id: expect.any(String),
  identifier: {
    value: expect.any(String)
  },
  images: expect.arrayOf(String),
  modelName: expect.any(String),
  name: expect.any(String),
  price: {
    originalValue: expect.any(Number),
    value: expect.any(Number),
    hasDiscount: expect.any(Boolean)
  },
  rating: {
    value: expect.nullOr(Number)
  },
  tagging: {
    click: TaggingSchema,
    add2cart: TaggingSchema,
    checkout: TaggingSchema
  },
  type: expect.any(String),
  url: expect.any(String),
  isWishlisted: expect.any(Boolean)
};
