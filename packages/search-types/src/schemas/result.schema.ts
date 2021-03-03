import { Result } from '../result/result.model';
import { IdentifiableSchema } from './identifiable.schema';
import { TaggingSchema } from './tagging.schema';

/**
 * Jest schema for validating Result entities.
 *
 * @public
 */
export const ResultSchema: Result = {
  ...IdentifiableSchema,
  callbackInfo: expect.any(Object),
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
 * Jest schema for validating Recommendation (AKA Result) entities.
 *
 * @public
 */
export const RecommendationSchema: Result = {
  callbackInfo: expect.any(Object),
  ...IdentifiableSchema,
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
