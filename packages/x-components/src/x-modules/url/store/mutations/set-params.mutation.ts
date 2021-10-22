import Vue from 'vue';
import { forEach } from '../../../../utils/object';
import { UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlMutations.setParams} mutation.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the history
 * queries module.
 * @param params - The mutation payload with the extra params to set in the state.
 * @remarks The change is done using `Vue.set` because we are adding new fields to the state. So
 * this is necessary to make them reactive.
 * @public
 */
export const setParams: UrlXStoreModule['mutations']['setParams'] = (state, params) => {
  forEach(params, (key, value) => {
    Vue.set(state, key, value);
  });
};
