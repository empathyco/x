import { Promoted } from '../promoted.model';
import { IdentifiableSchema } from './identifiable.schema';
import { TaggingSchema } from './tagging.schema';

/**
 * Jest schema for validating Promoted entities.
 *
 * @public
 */
export const PromotedSchema: Promoted = {
  ...IdentifiableSchema,
  image: expect.any(String),
  modelName: expect.any(String),
  tagging: {
    click: TaggingSchema
  },
  title: expect.any(String),
  url: expect.any(String)
};
