import { Facet } from './facet.model';
import { EditableNumberRangeFilter } from './filter';

/**
 * Editable Number Range Facet is a trait for filtering results using user editable {@link RangeValue}. Editable means that the value max
 * and min can be changed by the user instead of having several boolean filters with different values. It extends from {@link Facet},
 * changes the modelName and uses {@link EditableNumberRangeFilter} as filters.
 *
 * @public
 */
export interface EditableNumberRangeFacet extends Facet {
    /** Model name to indicate the facet type. */
    modelName: 'EditableNumberRangeFacet';
    /** Filters available for the facet. */
    filters: EditableNumberRangeFilter[];
}

/**
 * Type guard to check if a facet is an {@link EditableNumberRangeFacet}.
 *
 * @param facet - The facet to check.
 *
 * @public
 */
export function isEditableNumberRangeFacet(facet: Facet): facet is EditableNumberRangeFacet {
    return facet.modelName === 'EditableNumberRangeFacet';
}
