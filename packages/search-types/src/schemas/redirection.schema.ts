import { Redirection } from '../redirection.model';
import { TaggingSchema } from './tagging.schema';

/**
 * @public
 * Jest schema for validating Redirection entities
 */
export const RedirectionSchema: Redirection = {
  id: expect.any(String),
  title: expect.any(String),
  url: expect.any(String),
  tagging: {
    click: TaggingSchema
  }
};
