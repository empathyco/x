import type { DeepPartial } from '@empathyco/x-utils'
import type { SafeStore } from '../../../../store/__tests__/utils'
import type {
  ExperienceControlsActions,
  ExperienceControlsGetters,
  ExperienceControlsMutations,
  ExperienceControlsState,
} from '../types'
import { Store } from 'vuex'
import { resetStoreModuleState } from '../../../../__tests__/utils'
import { experienceControlsXStoreModule } from '../module'

/**
 * Resets the experience controls module state, optionally modifying its default values.
 *
 * @param store - Experience controls store state.
 * @param state - Partial experience controls store state to replace the original one.
 *
 * @internal
 */
export function resetExperienceControlsStateWith(
  store: Store<ExperienceControlsState>,
  state?: DeepPartial<ExperienceControlsState>,
): void {
  resetStoreModuleState(store, experienceControlsXStoreModule.state(), state)
}

/**
 * Creates an experience controls store with the state passed as parameter.
 *
 * @returns Store - The new store created.
 *
 * @internal
 */
export function createExperienceControlsStore(): Store<ExperienceControlsState> {
  const store: SafeStore<
    ExperienceControlsState,
    ExperienceControlsGetters,
    ExperienceControlsMutations,
    ExperienceControlsActions
    // eslint-disable-next-line ts/no-unsafe-argument
  > = new Store(experienceControlsXStoreModule as any)

  return store
}
