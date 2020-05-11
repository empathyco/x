import { ArrowKey } from '../../../utils/types';
import { EmpathizeXStoreModule } from './types';

/**
 * {@link XStoreModule} For the empathize module.
 *
 * @internal
 */
export const empathizeXStoreModule: EmpathizeXStoreModule = {
  state: () => ({
    config: {}
  }),
  getters: {},
  mutations: {},
  actions: {
    keyboardAction({ state }, arrowKey: ArrowKey) {
      // TODO decide what to do in this action, extract it to a file and rename it
      // eslint-disable-next-line no-console
      console.log('call keyboardAction', state, arrowKey);
    }
  }
};
