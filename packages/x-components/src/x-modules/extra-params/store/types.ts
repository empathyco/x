import type { Dictionary } from '@empathyco/x-utils'
import type { XStoreModule } from '../../../store'

/**
 * ExtraParams store state.
 *
 * @public
 */
export interface ExtraParamsState {
  params: Dictionary<unknown>
  /**
   * Key used to send the catalog section to the search API. It is consumed by the
   * {@link SearchXModule} request getter, which writes the section under this key, and by the
   * `ExtraParamsChanged` emitter, which omits it so it is not broadcast to the other modules.
   *
   * @defaultValue 'catalogSection'
   */
  catalogSectionParamKey: string
}

/**
 * ExtraParams store getters.
 *
 * @public
 */
export interface ExtraParamsGetters {}

/**
 * ExtraParams store mutations.
 *
 * @public
 */
export interface ExtraParamsMutations {
  setParams: (params: Dictionary<unknown>) => void
}

/**
 * ExtraParams store actions.
 *
 * @public
 */
export interface ExtraParamsActions {}

/**
 * ExtraParams type safe store module.
 *
 * @public
 */
export type ExtraParamsXStoreModule = XStoreModule<
  ExtraParamsState,
  ExtraParamsGetters,
  ExtraParamsMutations,
  ExtraParamsActions
>
