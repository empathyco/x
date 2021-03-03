import { CallbackInfo } from '../../callback-info.model';
import { Identifiable } from '../../identifiable.model';
import { FilterModelName, NamedModel } from '../../named-model.model';
import { Facet } from '../facet.model';

/**
 * A basic filter used in {@link Facet}, which is used to sift the results.
 *
 * @public
 */
export interface Filter extends NamedModel<FilterModelName>, CallbackInfo, Identifiable {
  /** An unique ID that identifies the facet that uses this filter */
  facetId: Facet['id'];
  /** Label that represents the filter text. */
  label: string;
}
