import { DeepPartial } from '@empathyco/x-utils';
import Vuex, { Store } from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import { resetStoreModuleState } from '../../../../__tests__/utils';
import { experienceControlsXStoreModule } from '../module';
import { ExperienceControlsState } from '../types';

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
  state?: DeepPartial<ExperienceControlsState>
): void {
  resetStoreModuleState(store, experienceControlsXStoreModule.state(), state);
}

/**
 * Creates an experience controls store with the state passed as parameter.
 *
 * @param state - Partial experience controls store state to replace the original one.
 * @returns Store - The new store created.
 *
 * @internal
 */
export function createExperienceControlsStore(
  state?: Partial<ExperienceControlsState>
): Store<ExperienceControlsState> {
  const localVue = createLocalVue();
  localVue.config.productionTip = false; // Silent production console messages.
  localVue.use(Vuex);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const store = new Store<ExperienceControlsState>(experienceControlsXStoreModule as any);

  resetExperienceControlsStateWith(store, state);

  return store;
}
