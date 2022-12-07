import { SearchBoxXStoreModule } from '../types';
import { StateMachine } from '../../../../services/state-machine.service';
import { SearchBoxMachine } from '../../search-box.machine';

const machine = new StateMachine(SearchBoxMachine);

/**
 * Default implementation for the {@link SearchBoxActions.setStatus}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param event - The event used to transition the state machine.
 * @public
 */
export const setStatus: SearchBoxXStoreModule['actions']['setStatus'] = ({ commit }, event) => {
  machine.transition(event);
  commit('setStatus', machine.currentState);
};
