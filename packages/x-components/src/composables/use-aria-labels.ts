import { ref } from 'vue'

/**
 * Configuration of the global aria labels for the components. Namespaces are the PascalCase
 * component names and every entry is optional, so the map can be set partially. The entries
 * `PageSelector.numberPage` and `BaseColumnPickerList.ariaLabel` are template strings: their
 * `{page}` and `{column}` tokens are substituted per item at resolution.
 *
 * @public
 */
export interface AriaLabelsConfig {
  PageSelector?: { pagination?: string; prevPage?: string; nextPage?: string; numberPage?: string }
  AICarousel?: { expand?: string; collapse?: string }
  BaseColumnPickerDropdown?: { ariaLabel?: string }
  BaseColumnPickerList?: { ariaLabel?: string }
  PageLoaderButton?: { ariaLabel?: string }
  BaseModal?: { ariaLabel?: string }
  BaseEventsModalOpen?: { ariaLabel?: string }
  BaseEventsModalClose?: { ariaLabel?: string }
  SortDropdown?: { ariaLabel?: string }
  Facets?: { ariaLabel?: string }
  FiltersSearch?: { ariaLabel?: string }
  SliderFilter?: { min?: string; max?: string }
  EditableNumberRangeFilter?: { min?: string; max?: string }
  SearchInput?: { ariaLabel?: string }
  ClearHistoryQueries?: { ariaLabel?: string }
  HistoryQueriesSwitch?: { ariaLabel?: string }
  HistoryQuery?: { remove?: string }
  RemoveHistoryQuery?: { ariaLabel?: string }
  ScrollToTop?: { ariaLabel?: string }
  BaseDropdown?: { ariaLabel?: string }
}

/**
 * Module-level reactive state holding the current {@link AriaLabelsConfig}.
 *
 * @internal
 */
export const ariaLabels = ref<AriaLabelsConfig>({})

/**
 * Composable which provides a handle to the global aria labels configuration. Calling `set`
 * reactively replaces the whole map, updating the aria labels of already mounted components
 * without re-mounting them.
 *
 * @returns A handle with a `set` method to replace the aria labels configuration.
 * @public
 */
export function useAriaLabels() {
  /**
   * Replaces the current aria labels configuration with the provided one.
   *
   * @param labels - The new aria labels configuration.
   */
  function set(labels: AriaLabelsConfig): void {
    ariaLabels.value = labels
  }

  return { set }
}

/**
 * Utility method for resetting the aria labels configuration to its initial empty state.
 *
 * @remarks Use only for testing.
 *
 * @internal
 */
export function resetAriaLabels(): void {
  ariaLabels.value = {}
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
