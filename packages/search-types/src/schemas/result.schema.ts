import { Result } from '../result/result.model';
import { IdentifiableSchema } from './identifiable.schema';
import { TaggingInfoSchema } from './tagging.schema';

/**
 * Jest schema for validating Result entities.
 *
 * @public
 */
export const ResultSchema: Result = {
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
    query: TaggingInfoSchema,
    click: TaggingInfoSchema,
    add2cart: TaggingInfoSchema,
    checkout: TaggingInfoSchema
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
    click: TaggingInfoSchema,
    add2cart: TaggingInfoSchema,
    checkout: TaggingInfoSchema
  },
  type: expect.any(String),
  url: expect.any(String),
  isWishlisted: expect.any(Boolean)
};
