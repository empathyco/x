import Vue from 'vue';
import { forEach } from '../../../../utils/object';
import { UrlXStoreModule } from '../types';

export const setParams: UrlXStoreModule['mutations']['setParams'] = (state, params) => {
  forEach(params, (key, value) => {
    Vue.set(state, key, value);
  });
};
