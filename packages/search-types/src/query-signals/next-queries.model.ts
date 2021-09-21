import { Identifiable } from '../identifiable.model';
import { NamedModel } from '../named-model.model';
import { NextQuery } from './next-query.model';

/**
 * A group of next queries.
 *
 * @public
 */
export interface NextQueries extends NamedModel<'NextQueries'>, Identifiable {
  /** Array of next queries available inside the group. */
  nextQueries: NextQuery[];
}
