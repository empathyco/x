import type { AriaLabels } from '../types/accesibility'

/**
 * Single source of truth for default labels (moved verbatim from the SFC `DEFAULTS`
 * constants). Every namespace has an explicit entry (even when empty) so the merge
 * iterates all keys uniformly and a consumer override is never dropped.
 *
 * @internal
 */
export const DEFAULT_ARIA_LABELS: AriaLabels = {
  PageSelector: {
    pagination: 'Pagination',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    numberPage: (page: number | string) => `Page ${page}`,
  },
  AICarousel: { expand: 'Expand', collapse: 'Collapse' },
  BaseColumnPickerDropdown: { dropdown: 'Select number of columns' },
  BaseColumnPickerList: { button: (column: number) => `${column} columns` },
  PageLoaderButton: { button: 'Load' },
  BaseModal: { modal: 'Base modal content' },
  BaseEventsModalOpen: { button: 'Open' },
  BaseEventsModalClose: { button: 'Close' },
  SortDropdown: { dropdown: 'Select sorting' },
  Facets: { root: 'Facets' },
  FiltersSearch: { input: 'search into the filter values' },
  SliderFilter: { min: 'minimum amount', max: 'maximum amount' },
  EditableNumberRangeFilter: { min: 'minimum amount', max: 'maximum amount' },
  SearchInput: { input: 'type your query here' },
  ClearHistoryQueries: { button: 'Clear all' },
  HistoryQueriesSwitch: { root: "Queries' history" },
  HistoryQuery: { removeButton: 'Remove' },
  RemoveHistoryQuery: { button: 'remove' },
  ScrollToTop: { button: 'Scroll to top' },
  BaseDropdown: { toggleButton: '' },
}

/**
 * Merges the provided aria labels entries onto the defaults: for each known key the provided
 * value wins, and unknown keys are ignored.
 *
 * @param labels - The aria labels entries to merge onto the defaults.
 * @returns The fully resolved aria labels configuration.
 *
 * @internal
 */
export function mergeAccesibilityLabels(labels: AriaLabels): AriaLabels {
  return Object.fromEntries(
    Object.entries(DEFAULT_ARIA_LABELS).map(([namespace, defaults]) => [
      namespace,
      {
        ...defaults,
        ...labels[namespace as keyof AriaLabels],
      },
    ]),
  ) as AriaLabels
}
