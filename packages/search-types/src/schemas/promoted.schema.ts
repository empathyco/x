import { Promoted } from '../promoted.model';
import { IdentifiableSchema } from './identifiable.schema';
import { TaggingInfoSchema } from './tagging.schema';

/**
 * Jest schema for validating Promoted entities.
 *
 * @public
 */
export const PromotedSchema: Promoted = {
  ...IdentifiableSchema,
  tagging: {
    click: TaggingInfoSchema
  },
  image: expect.any(String),
  modelName: expect.any(String),
  title: expect.any(String),
  url: expect.any(String)
};
