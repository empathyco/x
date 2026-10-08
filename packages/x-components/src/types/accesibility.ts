import type { InjectionKey } from 'vue'

/**
 * Configuration of the global aria labels for the components. Namespaces are the PascalCase
 * component names and every entry is optional, so the map can be set partially. The entries
 * `PageSelector.numberPage` and `BaseColumnPickerList.ariaLabel` are template strings: their
 * `page` and `column` tokens are substituted per item at resolution.
 *
 * @public
 */
export interface AriaLabels {
  pageSelector?: {
    pagination?: string
    prevPage?: string
    nextPage?: string
    numberPage?: (page: number | string) => string
  }
  aiCarousel?: { expand?: string; collapse?: string }
  baseColumnPickerDropdown?: { dropdown?: string }
  baseColumnPickerList?: { button?: (page: number) => string }
  pageLoaderButton?: { button?: string }
  baseModal?: { modal?: string }
  baseEventsModalOpen?: { button?: string }
  baseEventsModalClose?: { button?: string }
  sortDropdown?: { dropdown?: string }
  facets?: { root?: string }
  filtersSearch?: { input?: string }
  sliderFilter?: { min?: string; max?: string }
  editableNumberRangeFilter?: { min?: string; max?: string }
  searchInput?: { input?: string }
  clearHistoryQueries?: { button?: string }
  historyQueriesSwitch?: { root?: string }
  historyQuery?: { removeButton?: string }
  removeHistoryQuery?: { button?: string }
  scrollToTop?: { button?: string }
  baseDropdown?: { toggleButton?: string }
}

export const ACCESSIBILITY_KEY: InjectionKey<AriaLabels> = Symbol('accessibility')
