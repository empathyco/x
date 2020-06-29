import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { identifierResultsXStoreModule } from '../../store/module';
import { IdentifierResultsState } from '../../store/types';

/**
 * Reset identifier results x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial identifier results store state to be replaced.
 *
 * @internal
 */
export function resetStoreIdentifierResultState(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<IdentifierResultsState>
): void {
  resetStoreXModuleState(store, 'identifierResults', identifierResultsXStoreModule.state(), state);
}
