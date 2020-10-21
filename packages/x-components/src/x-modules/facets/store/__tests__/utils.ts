import { Store } from 'vuex';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { facetsXStoreModule } from '../module';
import { FacetsState } from '../types';

/**
 * Reset facets module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Facets store state.
 * @param state - Partial facets store state to be replaced.
 *
 * @internal
 */
export function resetFacetsStateWith(
  store: Store<FacetsState>,
  state?: DeepPartial<FacetsState>
): void {
  resetStoreModuleState<FacetsState>(store, facetsXStoreModule.state(), state);
}
