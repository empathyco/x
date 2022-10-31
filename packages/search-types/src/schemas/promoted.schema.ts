import { Promoted } from '../promoted.model';
import { IdentifiableSchema } from './identifiable.schema';
import { TaggingRequestSchema } from './tagging.schema';

/**
 * Jest schema for validating Promoted entities.
 *
 * @public
 */
export const PromotedSchema: Promoted = {
  ...IdentifiableSchema,
  tagging: {
    click: TaggingRequestSchema
  },
  image: expect.any(String),
  modelName: expect.any(String),
  title: expect.any(String),
  url: expect.any(String),
  position: expect.any(Number)
};
