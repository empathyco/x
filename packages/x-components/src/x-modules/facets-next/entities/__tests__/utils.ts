import { createLocalVue } from '@vue/test-utils';
import Vuex, { Store } from 'vuex';
import { RootXStoreState } from '../../../../store/store.types';
import { facetsNextXStoreModule } from '../../store/module';

export const prepareFacetsStore = (): Store<RootXStoreState> => {
  const vue = createLocalVue();
  vue.use(Vuex);
  return new Store({
    modules: {
      x: {
        modules: {
          facetsNext: { ...facetsNextXStoreModule, namespaced: true }
        },
        namespaced: true
      }
    }
  });
};
