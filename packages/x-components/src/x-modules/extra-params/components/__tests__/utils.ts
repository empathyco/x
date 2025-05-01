import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../../../../store/store.types'
import type { ExtraParamsState } from '../../store/types'
import { resetStoreXModuleState } from '../../../../__tests__/utils'
import { extraParamsXStoreModule } from '../../store/module'

/**
 * Reset extra params x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial extra params store state to be replaced.
 *
 * @internal
 */
export function resetXExtraParamStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<ExtraParamsState>,
): void {
  resetStoreXModuleState(store, 'extraParams', extraParamsXStoreModule.state(), state)
}
