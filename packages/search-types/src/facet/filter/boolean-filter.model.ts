import { BooleanFilterModelName } from '../../named-model.model';
import { Filter } from './filter.model';

/**
 * A boolean filter used in {@link Facet}, which status can be selected or not.
 *
 * @public
 */
export interface BooleanFilter extends Filter {
  /** Type to narrow {@link ModelNameType} from the extended Filter for the known subtypes */
  modelName: BooleanFilterModelName;
  /** Flag if the filter is selected or not. */
  selected: boolean;
  /** Filter value to use with the API. */
  value: string;
  /** Number of items for the filter. **/
  totalResults?: number;
}

/**
 * Type guard to check if a filter is a {@link BooleanFilter}.
 *
 * @param filter - The filter to check.
 *
 * @public
 */
export function isBooleanFilter(filter: Filter): filter is BooleanFilter {
  return typeof (filter as BooleanFilter).selected === 'boolean';
}
