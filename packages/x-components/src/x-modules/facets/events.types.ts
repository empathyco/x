import {
  Facet,
  Filter,
  HierarchicalFilter,
  NumberRangeFilter,
  SimpleFilter
} from '@empathy/search-types';
import { EditableNumberRangeFilterChange, MultiSelectChange } from './store/types';

/**
 * Dictionary of the events of Facets XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface FacetsXEvents {
  /**
   * The backend facets have changed.
   * * Payload: The {@link @empathy/search-types#Facet | facets} array.
   */
  BackendFacetsChanged: Facet[];
  /**
   * The developer has provided with some custom backend facets. This facets should have the
   * proper filters selected state.
   * * Payload: The new backend facets.
   */
  BackendFacetsProvided: Facet[];
  /**
   * The multi select configuration has changed for a facet.
   * * Payload: the facet id and the new value of the multiSelect.
   */
  FacetMultiSelectChanged: MultiSelectChange;
  /**
   * The query used in the module has changed.
   * * Payload: The facets query.
   */
  FacetsQueryChanged: string;
  /**
   * The frontend facets have changed.
   * * Payload: The facets array.
   */
  FrontendFacetsChanged: Facet[];
  /**
   * The selected filters have changed.
   * * Payload: filters array.
   */
  SelectedFiltersChanged: Filter[];
  /**
   * A user action has changed the selected filters.
   * * Payload: The new list of selected filters.
   */
  UserChangedSelectedFilters: Filter[];
  /**
   * The user has clicked any kind of filter.
   * * Payload: The clicked filter.
   *
   * @remarks This event does not imply changing the selection state of the filter. Business logic
   * can prevent the filter from changing its state.
   */
  UserClickedAFilter: Filter;
  /**
   * The user has clicked a filter which is of hierarchical type.
   * * Payload: The clicked filter.
   *
   * @remarks This event does not imply changing the selection state of the filter. Business logic
   * can prevent the filter from changing its state.
   */
  UserClickedAHierarchicalFilter: HierarchicalFilter;
  /**
   * The user has clicked a filter which is of number range type.
   * * Payload: The clicked filter.
   *
   * @remarks This event does not imply changing the selection state of the filter. Business logic
   * can prevent the filter from changing its state.
   */
  UserClickedANumberRangeFilter: NumberRangeFilter;
  /**
   * The user has clicked a filter which is of simple type.
   * * Payload: The clicked filter.
   *
   * @remarks This event does not imply changing the selection state of the filter. Business logic
   * can prevent the filter from changing its state.
   */
  UserClickedASimpleFilter: SimpleFilter;
  /**
   * The user has clicked button clear filters.
   * * Payload: array the facets ids.
   */
  UserClickedClearAllFilters: void;
  /**
   * The user has clicked button clear filters when there are facets ids.
   * * Payload: array the facets ids.
   */
  UserClickedClearFacetFilters: Array<Facet['id']>;
  /**
   * The user has clicked facet select all filters button.
   * * Payload: Facet id.
   */
  UserClickedFacetAllFilter: Facet['id'];
  /**
   * The user has modified a filter which is of editable number range filter type.
   * * Payload: An {@link EditableNumberRangeFilterChange | object}.
   */
  UserModifiedEditableNumberRangeFilter: EditableNumberRangeFilterChange;
}
