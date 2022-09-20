import {
  EditableNumberRangeFilter,
  Facet,
  Filter,
  HierarchicalFilter,
  NumberRangeFilter,
  RawFilter,
  SimpleFilter
} from '@empathyco/x-types';
import { FacetsGroup } from './service/types';

/**
 * Dictionary of the events of Facets XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface FacetsXEvents {
  /**
   * The facets from a group have changed
   * Payload: The group id and the new list of facets for it.
   */
  FacetsGroupChanged: FacetsGroup;
  /**
   * A new set of facets for the group has been provided.
   * Payload: The group id and the new list of facets for it.
   */
  FacetsGroupProvided: FacetsGroup;
  /**
   * The selected filters provided in the {@link SnippetConfig}.
   * Payload: the raw filters.
   */
  PreselectedFiltersProvided: RawFilter[];
  /**
   * The selected filters have changed.
   * Payload: the new list of selected filters.
   */
  SelectedFiltersChanged: Filter[];
  /**
   * A user action has changed the selected filters.
   * Payload: The new list of selected filters.
   */
  UserChangedSelectedFilters: Filter[];
  /**
   * The user has clicked any kind of filter.
   * Payload: The clicked filter.
   *
   * @remarks This event does not imply changing the selection state of the filter. Business logic
   * can prevent the filter from changing its state.
   */
  UserClickedAFilter: Filter;
  /**
   * The user has clicked a filter which is of hierarchical type.
   * Payload: The clicked filter.
   *
   * @remarks This event does not imply changing the selection state of the filter. Business logic
   * can prevent the filter from changing its state.
   */
  UserClickedAHierarchicalFilter: HierarchicalFilter;
  /**
   * The user has clicked a filter which is of number range type.
   * Payload: The clicked filter.
   *
   * @remarks This event does not imply changing the selection state of the filter. Business logic
   * can prevent the filter from changing its state.
   */
  UserClickedANumberRangeFilter: NumberRangeFilter;
  /**
   * The user has clicked a filter which is of simple type.
   * Payload: The clicked filter.
   *
   * @remarks This event does not imply changing the selection state of the filter. Business logic
   * can prevent the filter from changing its state.
   */
  UserClickedASimpleFilter: SimpleFilter;
  /**
   * The user has clicked facet select all filters button.
   * Payload: Facet id.
   */
  UserClickedAllFilter: [Facet['id']];
  /**
   * The user has modified a filter which is of editable number range filter type.
   * Payload: An {@link EditableNumberRangeFilter}.
   */
  UserModifiedEditableNumberRangeFilter: EditableNumberRangeFilter;
  /**
   * The user has clicked button clear filters.
   * Payload: array the facets ids.
   */
  UserClickedClearAllFilters: Array<Facet['id']> | undefined;
  /**
   * The query used in the module has changed.
   * Payload: The facets query.
   */
  FacetsQueryChanged: string;
}
