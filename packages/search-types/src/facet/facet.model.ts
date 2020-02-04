import { NamedModel } from '../named-model.model';
import { Filter } from './filter.model';

/**
 * @public
 * A trait for filtering results
 */
export interface Facet extends NamedModel {
  filters: Filter[];
  title: string;
}
