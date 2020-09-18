import { Redirection } from '../redirection.model';
import { TaggingSchema } from './tagging.schema';

/**
 * Jest schema for validating Redirection entities.
 *
 * @public
 */
export const RedirectionSchema: Redirection = {
  id: expect.any(String),
  title: expect.any(String),
  url: expect.any(String),
  tagging: {
    click: TaggingSchema
  }
};
