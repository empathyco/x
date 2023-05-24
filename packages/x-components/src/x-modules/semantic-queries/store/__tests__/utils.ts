import { Store } from 'vuex';
import { DeepPartial } from '@empathyco/x-utils/src/index';
import { SemanticQueriesState } from '../types';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { semanticQueriesXStoreModule } from '../module';

export function resetSemanticQueriesStateWith(
  store: Store<SemanticQueriesState>,
  state?: DeepPartial<SemanticQueriesState>
): void {
  resetStoreModuleState(store, semanticQueriesXStoreModule.state(), state);
}
