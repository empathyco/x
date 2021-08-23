import { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { DeepPartial } from '../../../../utils/types';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { extraParamsXStoreModule } from '../../store/module';
import { ExtraParamsState } from '../../store/types';

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
  state?: DeepPartial<ExtraParamsState>
): void {
  resetStoreXModuleState(store, 'extraParams', extraParamsXStoreModule.state(), state);
}
