import { NamedModel } from '../named-model.model';
import { NextQuery } from './next-query.model';

/**
 * A group of next queries.
 *
 * @public
 */
export interface NextQueries extends NamedModel {
  /** An unique ID that identifies the next queries group. */
  id: string;
  /** Array of next queries available inside the group. */
  nextQueries: NextQuery[];
}
