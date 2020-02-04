import { NamedModel } from '../named-model.model';
import { NextQuery } from './next-query.model';

/**
 * @public
 * A group of next queries
 */
export interface NextQueries extends NamedModel {
  id: string;
  nextQueries: NextQuery[];
}
