import { Filter } from '@empathy/search-types';

/**
 * Dictionary of the events of Facets XModule, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface FacetsXEvents {
  /**
   * The selected filters have changed.
   * * Payload: filters array.
   */
  SelectedFiltersChanged: Filter[];
  /**
   * The user has clicked a filter.
   * * Payload: The clicked filter.
   *
   * @remarks This event does not imply changing the selection state of the filter. Business logic
   * can prevent the filter from changing its state.
   */
  UserClickedAFilter: Filter;
  /**
   * The multi select configuration has changed for a facet.
   * * Payload: the facet id and the new value of the multiSelect.
   */
  FacetMultiSelectChanged: MultiSelectChange;
}

/**
 * Payload for the {@link FacetsXEvents.FacetMultiSelectChanged} event.
 *
 * @public
 */
export interface MultiSelectChange {
  /** The facet unique identifier. */
  facetId: string;
  /** The facet multiSelect new value. */
  multiSelect: boolean;
}
