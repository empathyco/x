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
   * Payload: filters array.
   */
  SelectedFiltersChanged: Filter[];
}
