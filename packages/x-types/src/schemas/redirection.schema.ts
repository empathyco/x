import { Redirection } from '../redirection.model';
import { IdentifiableSchema } from './identifiable.schema';
import { TaggingRequestSchema } from './tagging.schema';

/**
 * Jest schema for validating Redirection entities.
 *
 * @public
 */
export const RedirectionSchema: Redirection = {
  ...IdentifiableSchema,
  tagging: {
    click: TaggingRequestSchema
  },
  modelName: 'Redirection',
  url: expect.any(String)
};
