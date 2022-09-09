import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { queriesPreviewXStoreModule } from '../../store/module';
import { QueriesPreviewState } from '../../store/types';

/**
 * Reset queries preview x-module state with its original state and the partial state passes as
 * parameter.
 *
 * @param store - Root state of the x-modules.
 * @param state - Partial queries preview store state to be replaced.
 *
 * @internal
 */
export function resetXQueriesPreviewStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<QueriesPreviewState>
): void {
  resetStoreXModuleState(store, 'queriesPreview', queriesPreviewXStoreModule.state(), state);
}
