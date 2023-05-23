import { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils';
import { SemanticQueriesState, semanticQueriesXStoreModule } from '../../store/index';
import { resetStoreXModuleState } from '../../../../__tests__/utils';
import { RootXStoreState } from '../../../../store/index';

export function resetSemanticQueriesStateWith(
  store: Store<DeepPartial<RootXStoreState>>,
  state?: DeepPartial<SemanticQueriesState>
): void {
  resetStoreXModuleState(store, 'semanticQueries', semanticQueriesXStoreModule.state(), state);
}
