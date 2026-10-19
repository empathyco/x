import type { SearchXStoreModule } from '../types'

/**
 * Default implementation for the {@link SearchGetters.request} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the search
 * module.
 * @param getters - Current {@link https://vuex.vuejs.org/guide/getters.html | getters} of the
 * search module.
 * @param rootState - Current root state of the store, used to read the `catalogSection` extra
 * param provided by the instance, which is not broadcasted through the `ExtraParamsChanged` event.
 * @returns The search request to fetch data from the API.
 * @public
 */
export const request: SearchXStoreModule['getters']['request'] = (
  { catalogSection, config, page, params, selectedFilters: filters, sort },
  { query },
  rootState,
) => {
  if (!query) {
    return null
  }
  const catalogSectionParamKey =
    rootState.x?.extraParams?.catalogSectionParamKey ?? 'catalogSection'
  const extraParams = rootState.x?.extraParams?.params
  const providedCatalogSection =
    extraParams && catalogSectionParamKey in extraParams
      ? extraParams[catalogSectionParamKey]
      : params[catalogSectionParamKey]
  const selectedCatalogSection = catalogSection ?? providedCatalogSection

  return {
    query,
    sort,
    page,
    filters,
    extraParams:
      selectedCatalogSection !== undefined || config.defaultCatalogSection
        ? {
            ...params,
            [catalogSectionParamKey]: selectedCatalogSection || config.defaultCatalogSection,
          }
        : params,
  }
}
