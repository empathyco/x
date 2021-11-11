import Vue from 'vue';
import { Dictionary } from '../../../utils/types';
import { ScrollComponentState } from './types';

/**
 * Initialises an {@link ScrollComponentState} object if it has not already been created.
 *
 * @param state - The state shere the new data should be added.
 * @param id - The identifier for the {@link ScrollComponentState}.
 *
 * @internal
 */
export function initScrollComponentState(
  state: Dictionary<ScrollComponentState>,
  id: string
): void {
  if (!state[id]) {
    Vue.set<ScrollComponentState>(state, id, {
      hasReachedStart: false,
      hasReachedEnd: false,
      position: 0,
      direction: 'UP'
    });
  }
}
