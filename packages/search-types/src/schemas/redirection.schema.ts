import { Redirection } from '../redirection.model';
import { IdentifiableSchema } from './identifiable.schema';
import { TaggingInfoSchema } from './tagging.schema';

/**
 * Jest schema for validating Redirection entities.
 *
 * @public
 */
export const RedirectionSchema: Redirection = {
  ...IdentifiableSchema,
  tagging: {
    click: TaggingInfoSchema
  },
  modelName: 'Redirection',
  url: expect.any(String)
};
