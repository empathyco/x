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
  // The key under which the catalog section is sent is provided by the extra params module. When
  // it is not available (the module may not be installed), the default one is used.
  const catalogSectionParamKey =
    rootState.x?.extraParams?.catalogSectionParamKey ?? 'catalogSection'
  // The catalog section selected by the user or loaded from the URL has precedence. When none has
  // been selected, the extra params module, which may not be installed, and the `x` root module,
  // which may not be registered either, are only read to support a section provided by the
  // instance, and then the search params, which receive the section of a query preview.
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
    // The default catalog section is only sent when a section has not been selected, either
    // because it was never selected or because it was reset to an empty value.
    extraParams:
      selectedCatalogSection !== undefined || config.defaultCatalogSection
        ? {
            ...params,
            [catalogSectionParamKey]: selectedCatalogSection || config.defaultCatalogSection,
          }
        : params,
  }
}
