import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { queriesPreviewXStoreModule } from '../module';
import { QueriesPreviewState } from '../types';

/**
 * Reset queries preview module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Queries preview store state.
 * @param state - Partial queries preview store state to be replaced.
 *
 * @internal
 */
export function resetQueriesPreviewStateWith(
  store: Store<QueriesPreviewState>,
  state?: DeepPartial<QueriesPreviewState>
): void {
  resetStoreModuleState<QueriesPreviewState>(store, queriesPreviewXStoreModule.state(), state);
}
