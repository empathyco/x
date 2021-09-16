import { Redirection } from '../redirection.model';
import { IdentifiableSchema } from './identifiable.schema';
import { TaggingSchema } from './tagging.schema';

/**
 * Jest schema for validating Redirection entities.
 *
 * @public
 */
export const RedirectionSchema: Redirection = {
  ...IdentifiableSchema,
  modelName: 'Redirection',
  url: expect.any(String),
  tagging: {
    click: TaggingSchema
  }
};
