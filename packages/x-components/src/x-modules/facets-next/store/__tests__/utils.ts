import { Store } from 'vuex';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { DeepPartial } from '../../../../utils/types';
import { facetsNextXStoreModule } from '../module';
import { FacetsNextState } from '../types';

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
  store: Store<FacetsNextState>,
  state?: DeepPartial<FacetsNextState>
): void {
  resetStoreModuleState<FacetsNextState>(store, facetsNextXStoreModule.state(), state);
}
