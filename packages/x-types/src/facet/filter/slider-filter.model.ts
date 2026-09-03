import type { FacetFilter } from './facet-filter.model'
import type { Filter } from './filter.model'
import type { RangeValue } from './range-value.model'

/**
 * A type of filter used in {@link EditableNumberRangeFacet} and extends from {@link FacetFilter}.
 * This filter has the particularity that its {@link RangeValue} is editable by the user.
 * Editable means that the value max and min can be changed by the user instead of having
 * several boolean filters with different values.
 *
 * @public
 */
export interface SliderFilter extends FacetFilter {
  /** Model name to indicate the filter type. */
  modelName: 'SliderFilter'
  /** Filter range to use in the frontend. */
  range: { min: number; max: number }

  unit: Intl.NumberFormatOptions['style']
}

/**
 * Type guard to check if a filter is an {@link SliderFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns True if the filter is an {@link SliderFilter}, false otherwise.
 *
 * @public
 */
export function isSliderFilter(filter: Filter): filter is SliderFilter {
  return filter.modelName === 'SliderFilter'
}
