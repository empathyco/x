import { CallbackInfo } from '../../callback-info.model';
import { FilterModelName, NamedModel } from '../../named-model.model';

/**
 * A basic filter used in {@link Facet}, which is used to sift the results.
 *
 * @public
 */
export interface Filter extends NamedModel<FilterModelName>, CallbackInfo {
  /** An unique ID that identifies the filter. */
  id: string;
  /** An unique ID that identifies the facet that uses this filter */
  facetId: string;
  /** Label that represents the filter text. */
  label: string;
  /** Flag if the filter is selected or not. */
  selected: boolean;
  /** Filter value to use with the API. Defined by the subtypes. */
  value: unknown;
  /** Number of items for the filter. **/
  totalResults: number;
}
