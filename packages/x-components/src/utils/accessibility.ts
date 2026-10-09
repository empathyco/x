import type { AriaLabels } from '../types/accessibility'

/**
 * Single source of truth for default labels (moved verbatim from the SFC `DEFAULTS`
 * constants). Every namespace has an explicit entry (even when empty) so the merge
 * iterates all keys uniformly and a consumer override is never dropped.
 *
 * @internal
 */
export const DEFAULT_ARIA_LABELS: AriaLabels = {
  pageSelector: {
    pagination: 'Pagination',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    numberPage: (page: number | string) => `Page ${page}`,
  },
  aiCarousel: { expand: 'Expand', collapse: 'Collapse' },
  baseColumnPickerDropdown: { dropdown: 'Select number of columns' },
  baseColumnPickerList: { button: (column: number) => `${column} columns` },
  pageLoaderButton: { button: 'Load' },
  baseModal: { modal: 'Base modal content' },
  baseEventsModalOpen: { button: 'Open' },
  baseEventsModalClose: { button: 'Close' },
  sortDropdown: { dropdown: 'Select sorting' },
  facets: { root: 'Facets' },
  filtersSearch: { input: 'search into the filter values' },
  sliderFilter: { min: 'minimum amount', max: 'maximum amount' },
  editableNumberRangeFilter: { min: 'minimum amount', max: 'maximum amount' },
  searchInput: { input: 'type your query here' },
  clearHistoryQueries: { button: 'Clear all' },
  historyQueriesSwitch: { root: "Queries' history" },
  historyQuery: { removeButton: 'Remove' },
  removeHistoryQuery: { button: 'remove' },
  scrollToTop: { button: 'Scroll to top' },
  baseDropdown: { toggleButton: '' },
}
