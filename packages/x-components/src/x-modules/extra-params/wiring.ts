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
 * @remarks The `catalogSection` param is not wired here on purpose: the selected catalog section
 * is owned by the {@link SearchXModule} state, which is the only module that sends it to the API.
 * It is still stored here when the instance provides it, and read by the search request as a
 * fallback, but it is never broadcast to the other modules.
 *
 * @public
 */
export const setExtraParams = wireCommit('setParams')

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
})
