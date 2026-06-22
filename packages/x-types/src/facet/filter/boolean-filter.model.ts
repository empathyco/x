import type { BooleanFilterModelName } from '../../named-model.model'
import type { FacetFilter } from './facet-filter.model'
import type { Filter } from './filter.model'
import { BooleanFilterModelNames } from '../../named-model.model'

/**
 * A boolean filter used in a {@link FacetFilter}, which status can be selected or not and
 * it may contains the total results number that the filter should return.
 *
 * @public
 */
export interface BooleanFilter extends FacetFilter {
  /** Text to render the filter label. */
  label: string
  /** Type to narrow {@link ModelNameType} from the extended Filter for the known subtypes. */
  modelName: BooleanFilterModelName
  /** Amount of matching results. */
  totalResults?: number
}

/**
 * Type guard to check if a filter is a {@link BooleanFilter}.
 *
 * @param filter - The filter to check.
 *
 * @returns True if the filter is a {@link BooleanFilter}, false otherwise.
 *
 * @public
 */
export function isBooleanFilter(filter: Filter): filter is BooleanFilter {
  return BooleanFilterModelNames.includes(filter.modelName as BooleanFilterModelName)
}
