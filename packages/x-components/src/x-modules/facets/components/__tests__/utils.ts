import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { facetsXStoreModule } from '../../store/module';
import { FacetsState } from '../../store/types';

/**
 * Reset facets x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial facets store state to use as replacement.
 *
 * @internal
 */
export function resetXFacetsStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<FacetsState>
): void {
  resetStoreXModuleState(store, 'facets', facetsXStoreModule.state(), state);
}
