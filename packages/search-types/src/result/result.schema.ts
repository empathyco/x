import { TaggingSchema } from '../tagging.schema';
import { Result } from './result.model';

export const ResultSchema: Result = {
  callbackInfo: expect.any(Object),
  id: expect.any(String),
  identifier: {
    html: expect.any(String),
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
    add2cart: TaggingSchema
  },
  type: expect.any(String),
  url: expect.any(String)
};

export const RecommendationSchema: Result = {
  callbackInfo: expect.any(Object),
  id: expect.any(String),
  identifier: {
    html: expect.any(String),
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
    add2cart: TaggingSchema
  },
  type: expect.any(String),
  url: expect.any(String)
};
