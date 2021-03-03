import { Identifiable } from '../identifiable.model';
import { FacetModelName, NamedModel } from '../named-model.model';
import { Filter } from './filter/filter.model';

/**
 * Facet is a trait for filtering results. It uses {@link Filter} as filters.
 *
 * @public
 */
export interface Facet extends NamedModel<FacetModelName>, Identifiable {
  /** Filters available for the facet. */
  filters: Filter[];
  /** Label that represents the facet text. */
  label: string;
}
