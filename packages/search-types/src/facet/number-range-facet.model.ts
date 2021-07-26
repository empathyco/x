import { Facet } from './facet.model';
import { NumberRangeFilter } from './filter/number-range-filter.model';

/**
 * Number Range Facet is a trait for filtering results. It extends from {@link Facet},
 * changes the modelName and uses {@link NumberRangeFilter} as filters.
 *
 * @public
 */
export interface NumberRangeFacet extends Facet {
  /** Model name to indicate the facet type. */
  modelName: 'NumberRangeFacet';
  /** Filters available for the facet. */
  filters: NumberRangeFilter[];
}

/**
 * Type guard to check if a facet is an {@link NumberRangeFacet}.
 *
 * @param facet - The facet to check.
 *
 * @returns A boolean that represents if a facet is an {@link NumberRangeFacet}.
 *
 * @public
 */
export function isNumberRangeFacet(facet: Facet): facet is NumberRangeFacet {
  return facet.modelName === 'NumberRangeFacet';
}
