import { Identifiable } from '../../identifiable.model';
import { FilterModelName, NamedModel } from '../../named-model.model';

/**
 * A basic filter.
 *
 * @remarks It is like an "abstract" interface because it is not going to be implemented
 * but it is extended by other interfaces. There will never be an object with this type.
 *
 * @public
 */
export interface Filter extends NamedModel<FilterModelName>, Identifiable {
  /** Flag if the filter is selected or not. */
  selected: boolean;
}
