import { DeepPartial } from '@empathyco/x-utils';
import { Store } from 'vuex';
import { SearchRequest } from '@empathyco/x-types';
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

/**
 * Creates a queries preview search request stub.
 *
 * @param query - The query to set in the request.
 * @returns A {@link SearchRequest} to use with queries preview.
 *
 * @internal
 */
export function getQueryPreviewRequest(query: string): SearchRequest {
  return {
    query,
    rows: 3,
    extraParams: {
      extraParam: 'extra param'
    }
  };
}
