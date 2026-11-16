import type { Dictionary } from '@empathyco/x-utils'
import type { ExtraParamsState } from './types'
import { deepEqual } from '@empathyco/x-utils'
import { createStoreEmitters } from '../../../store'
import { extraParamsXStoreModule } from './module'

/**
 * Removes the catalog section param from the given extra params, as it is only consumed by the
 * search request. The key used to send the catalog section is configurable through the
 * {@link ExtraParamsState.catalogSectionParamKey} state property.
 *
 * @param params - The extra params stored in the {@link ExtraParamsXModule}.
 * @param catalogSectionParamKey - The key under which the catalog section is sent.
 * @returns The given extra params without the catalog section param.
 *
 * @internal
 */
function omitCatalogSection(
  params: Dictionary<unknown>,
  catalogSectionParamKey: string,
): Dictionary<unknown> {
  const paramsWithoutCatalogSection = { ...params }
  delete paramsWithoutCatalogSection[catalogSectionParamKey]
  return paramsWithoutCatalogSection
}

/**
 * {@link StoreEmitters} For the {@link ExtraParamsXModule}.
 *
 * @internal
 */
export const extraParamsEmitters = createStoreEmitters(extraParamsXStoreModule, {
  ExtraParamsChanged: {
    // The catalog section is only consumed by the search request, which reads it from the extra
    // params state as a fallback, so it is not broadcasted to the rest of the modules.
    selector: (state: ExtraParamsState) =>
      omitCatalogSection(state.params, state.catalogSectionParamKey),
    // Emits only when a param other than the catalog section changes. Otherwise, changing just
    // the catalog section would still trigger a refetch on every other module.
    filter: (newValue, oldValue) => !deepEqual(newValue, oldValue),
    metadata: { priority: 9 },
  },
})
