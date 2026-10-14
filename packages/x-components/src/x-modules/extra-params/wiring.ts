import { namespacedWireCommit } from '../../wiring'
import { createWiring } from '../../wiring/wiring.utils'

/**
 * WireCommit for {@link ExtraParamsXModule}.
 *
 * @internal
 */
const wireCommit = namespacedWireCommit('extraParams')

/**
 * Sets the extra params of the {@link ExtraParamsXModule}.
 *
 * @public
 */
export const setExtraParams = wireCommit('setParams')

/**
 * Sets the `catalogSection` extra param from the selected catalog section.
 *
 * @public
 */
export const setCatalogSectionExtraParam = wireCommit('setParams', ({ eventPayload }) => ({
  catalogSection: eventPayload,
}))

/**
 * Resets the `catalogSection` extra param.
 *
 * @public
 */
export const resetCatalogSectionExtraParam = wireCommit('setParams', { catalogSection: '' })

/**
 * Wiring configuration for the {@link ExtraParamsXModule | extraParams module}.
 *
 * @internal
 */
export const extraParamsWiring = createWiring({
  UserChangedExtraParams: {
    setExtraParams,
  },
  ExtraParamsProvided: {
    setExtraParams,
  },
  ExtraParamsLoadedFromUrl: {
    setExtraParams,
  },
  UserSelectedACatalogSection: {
    setCatalogSectionExtraParam,
  },
  UserClearedQuery: {
    resetCatalogSectionExtraParam,
  },
  UserBrowsedToCategory: {
    resetCatalogSectionExtraParam,
  },
  UserClickedCloseX: {
    resetCatalogSectionExtraParam,
  },
})
