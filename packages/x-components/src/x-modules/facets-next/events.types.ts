import { Filter, EditableNumberRangeFilter, Facet } from '@empathyco/x-types-next';
import { FacetsGroup } from './service/types';

/**
 * Dictionary of the events of Facets XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface FacetsNextXEvents {
  /**
   * The facets from a group have changed
   * * Payload: The group id and the new list of facets for it.
   */
  FacetsGroupChanged: FacetsGroup;
  /**
   * A new set of facets for the group has been provided.
   * * Payload: The group id and the new list of facets for it.
   **/
  FacetsGroupProvided: FacetsGroup;
  /**
   * The selected filters have changed.
   * * Payload: the new list of selected filters.
   */
  SelectedFiltersNextChanged: Filter[];
  /**
   * A user action has changed the selected filters.
   * * Payload: The new list of selected filters.
   */
  UserChangedSelectedNextFilters: Filter[];
  /**
   * The user has clicked any kind of filter.
   * * Payload: The clicked filter.
   *
   * @remarks This event does not imply changing the selection state of the filter. Business logic
   * can prevent the filter from changing its state.
   */
  UserClickedANextFilter: Filter;
  /**
   * The user has clicked facet select all filters button.
   * * Payload: Facet id.
   */
  UserClickedAllFilter: [Facet['id']];
  /**
   * The user has modified a filter which is of editable number range filter type.
   * * Payload: An {@link EditableNumberRangeFilterChange | object}.
   */
  UserModifiedEditableNumberRangeNextFilter: EditableNumberRangeFilter;
}
