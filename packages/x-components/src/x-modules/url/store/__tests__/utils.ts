import type { DeepPartial } from '@empathyco/x-utils'
import type { UrlState } from '../types'
import { Store } from 'vuex'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { urlXStoreModule } from '../module'

/**
 * Resets the url module state, optionally modifying its default values.
 *
 * @param store - URL store state.
 * @param state - Partial URL store state to replace the original one.
 *
 * @internal
 */
export function resetUrlStateWith(store: Store<UrlState>, state?: DeepPartial<UrlState>): void {
  resetStoreModuleState(store, urlXStoreModule.state(), state)
}

/**
 * Creates an URL store with the state passed as parameter.
 *
 * @param state - Partial URL store state to replace the original one.
 *
 * @returns Store - The new store created.
 *
 * @internal
 */
export function createUrlStore(state?: Partial<UrlState>): Store<UrlState> {
  // eslint-disable-next-line ts/no-unsafe-argument
  const store = new Store<UrlState>(urlXStoreModule as any)
  resetUrlStateWith(store, state)
  return store
}
