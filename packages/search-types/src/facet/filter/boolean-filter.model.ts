import { BooleanFilterModelName } from '../../named-model.model';
import { Filter } from './filter.model';

/**
 * A boolean filter used in a {@link Facet}, which status can be selected or not and
 * it may contains the total results number that the filter should return.
 *
 * @remarks It is like an "abstract" interface because it is not going to be implemented
 * but it is extended by other interfaces. There will never be an object with this type.
 *
 * @public
 */
export interface BooleanFilter extends Filter {
    /** Type to narrow {@link ModelNameType} from the extended Filter for the known subtypes. */
    modelName: BooleanFilterModelName;
    /** Text to render the filter label. */
    label: string;
    /** Value to be sent to the backend. */
    value: string;
    /** Amount of matching results. **/
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
   return 'label' in filter && 'value' in filter;
}
