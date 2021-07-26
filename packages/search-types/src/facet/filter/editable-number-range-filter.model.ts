import { FacetFilter } from './facet-filter.model';
import { Filter } from './filter.model';
import { RangeValue } from './range-value.model';

/**
 * A type of filter used in {@link EditableNumberRangeFacet} and extends from {@link FacetFilter}.
 * This filter has the particularity that its {@link RangeValue} is editable by the user.
 * Editable means that the value max and min can be changed by the user instead of having
 * several boolean filters with different
 * values.
 *
 * @public
 */
export interface EditableNumberRangeFilter extends FacetFilter {
  /** Model name to indicate the filter type. */
  modelName: 'EditableNumberRangeFilter';
  /** Filter range to use in the frontend. */
  range: RangeValue;
}

/**
 * Type guard to check if a filter is an {@link EditableNumberRangeFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns A boolean that represents if a filter is an {@link EditableNumberRangeFilter}.
 *
 * @public
 */
export function isEditableNumberRangeFilter(filter: Filter): filter is EditableNumberRangeFilter {
  return filter.modelName === 'EditableNumberRangeFilter';
}
