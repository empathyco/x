/**
 * Configuration of the global aria labels for the components. Namespaces are the PascalCase
 * component names and every entry is optional, so the map can be set partially. The entries
 * `PageSelector.numberPage` and `BaseColumnPickerList.ariaLabel` are template strings: their
 * `page` and `column` tokens are substituted per item at resolution.
 *
 * @public
 */
export interface AriaLabels {
  PageSelector?: {
    pagination?: string
    prevPage?: string
    nextPage?: string
    numberPage?: (page: number | string) => string
  }
  AICarousel?: { expand?: string; collapse?: string }
  BaseColumnPickerDropdown?: { dropdown?: string }
  BaseColumnPickerList?: { button?: (page: number) => string }
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
