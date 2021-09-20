import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { urlXStoreModule } from '../../store/module';
import { UrlState } from '../../store/types';

/**
 * Reset Url x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial Url store state to be replaced.
 *
 * @internal
 */
export function resetStoreUrlState(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<UrlState>
): void {
  resetStoreXModuleState(store, 'url', urlXStoreModule.state(), state);
}
