import type { DeepPartial } from '@empathyco/x-utils'
import type { Store } from 'vuex'
import type { FacetsState } from '../types'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { facetsXStoreModule } from '../module'

/**
 * Reset facets module state with its original state and the partial state passed as
 * parameter.
 *
 * @param store - Facets store state.
 * @param state - Partial facets store state to be replaced.
 *
 * @internal
 */
export function resetFacetsStateWith(
  store: Store<FacetsState>,
  state?: DeepPartial<FacetsState>,
): void {
  resetStoreModuleState<FacetsState>(store, facetsXStoreModule.state(), state)
}
