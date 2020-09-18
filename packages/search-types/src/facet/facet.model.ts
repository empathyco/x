import { NamedModel } from '../named-model.model';
import { Filter } from './filter.model';

/**
 * A trait for filtering results.
 *
 * @public
 */
export interface Facet extends NamedModel {
  /** Filters available for the facet. */
  filters: Filter[];
  /** Facet name. */
  title: string;
}
