import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { identifierResultsXStoreModule } from '../module';
import { IdentifierResultsState } from '../types';

/**
 * Reset identifier results module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Identifier results store state.
 * @param state - Partial identifier results store state to be replaced.
 *
 * @internal
 */
export function resetIdentifierResultsStateWith(
  store: Store<IdentifierResultsState>,
  state?: DeepPartial<IdentifierResultsState>
): void {
  resetStoreModuleState<IdentifierResultsState>(
    store,
    identifierResultsXStoreModule.state(),
    state
  );
}
