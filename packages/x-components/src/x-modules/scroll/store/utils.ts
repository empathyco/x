import Vue from 'vue';
import { Dictionary } from '../../../utils/types';
import { ScrollComponentState } from './types';

/**
 * Initialises an {@link ScrollComponentState} object if it has not already been created.
 *
 * @param componentsState - The state where the new data should be added.
 * @param id - The identifier for the {@link ScrollComponentState}.
 *
 * @internal
 */
export function initScrollComponentState(
  componentsState: Dictionary<ScrollComponentState>,
  id: string
): void {
  if (!componentsState[id]) {
    Vue.set<ScrollComponentState>(componentsState, id, {
      hasReachedStart: false,
      hasReachedEnd: false,
      position: 0,
      direction: 'UP'
    });
  }
}
