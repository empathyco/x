import { ref } from 'vue'

/**
 * Configuration of the global aria labels for the components. Namespaces are the PascalCase
 * component names and every entry is optional, so the map can be set partially. The entries
 * `PageSelector.numberPage` and `BaseColumnPickerList.ariaLabel` are template strings: their
 * `{page}` and `{column}` tokens are substituted per item at resolution.
 *
 * @public
 */
export interface AriaLabels {
  PageSelector?: { pagination?: string; prevPage?: string; nextPage?: string; numberPage?: string }
  AICarousel?: { expand?: string; collapse?: string }
  BaseColumnPickerDropdown?: { dropdown?: string }
  BaseColumnPickerList?: { button?: string }
  PageLoaderButton?: { button?: string }
  BaseModal?: { modal?: string }
  BaseEventsModalOpen?: { button?: string }
  BaseEventsModalClose?: { button?: string }
  SortDropdown?: { dropdown?: string }
  Facets?: { root?: string }
  FiltersSearch?: { input?: string }
  SliderFilter?: { min?: string; max?: string }
  EditableNumberRangeFilter?: { min?: string; max?: string }
  SearchInput?: { input?: string }
  ClearHistoryQueries?: { button?: string }
  HistoryQueriesSwitch?: { root?: string }
  HistoryQuery?: { removeButton?: string }
  RemoveHistoryQuery?: { button?: string }
  ScrollToTop?: { button?: string }
  BaseDropdown?: { toggleButton?: string }
}

/**
 * Single source of truth for default labels (moved verbatim from the 19 SFC
 * `DEFAULTS` constants). `BaseDropdown.ariaLabel` is explicit `undefined` so the
 * merge iterates all 26 keys uniformly and a consumer override is never dropped.
 *
 * @internal
 */
export const DEFAULT_ARIA_LABELS: AriaLabels = {
  PageSelector: {
    pagination: 'Pagination',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    numberPage: 'Page {page}',
  },
  AICarousel: { expand: 'Expand', collapse: 'Collapse' },
  BaseColumnPickerDropdown: { dropdown: 'Select number of columns' },
  BaseColumnPickerList: { button: '{column} columns' },
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

function mergeAriaLabels(labels: AriaLabels): AriaLabels {
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

/**
 * Module-level reactive state holding the fully resolved aria labels: every namespace and key is
 * always present, initialized with the complete defaults map.
 *
 * @internal
 */
export const ariaLabels = ref<AriaLabels>(DEFAULT_ARIA_LABELS)

/**
 * Composable which provides a handle to the global aria labels configuration. Calling `set`
 * reactively merges the provided entries onto the defaults, updating the aria labels of already
 * mounted components without re-mounting them.
 *
 * @returns A handle with a `set` method to update the aria labels configuration.
 * @public
 */
export function useAriaLabels() {
  /**
   * Updates the global aria labels configuration by merging the provided entries onto the
   * defaults: for each known key the provided value wins, so explicit `null`/`undefined`
   * entries are no-ops; omit a key to drop a previous override. Unknown keys are ignored.
   *
   * @param labels - The aria labels entries to merge onto the defaults.
   */
  function set(labels: AriaLabels): void {
    ariaLabels.value = mergeAriaLabels(labels)
  }

  return { set }
}

/**
 * Utility method for resetting the aria labels configuration to its initial state: the complete
 * defaults map, with fresh objects.
 *
 * @remarks Use only for testing.
 *
 * @internal
 */
export function resetAriaLabels(): void {
  ariaLabels.value = DEFAULT_ARIA_LABELS
}

/**
 * Substitutes the `{token}` placeholders of a label template with the provided values. Tokens
 * without a matching value are left literal, and number values are converted to strings.
 *
 * @param template - The label template containing `{token}` placeholders.
 * @param values - The values to substitute the tokens with.
 * @returns The label with the tokens substituted.
 *
 * @internal
 */
export function formatAriaLabelTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) =>
    key in values ? String(values[key]) : token,
  )
}
