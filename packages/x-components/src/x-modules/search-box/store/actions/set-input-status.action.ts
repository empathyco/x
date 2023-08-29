import { SearchBoxXStoreModule, InputStatus } from '../types';
import { StateMachine } from '../../../../services/state-machine.service';
import { XEvent } from '../../../../wiring/events.types';

/**
 * State machine that defines the different states through which the search box
 * can transition.
 */
const machine = new StateMachine<InputStatus, XEvent>({
  initial: 'initial',
  states: {
    initial: {
      UserAcceptedAQuery: 'filled',
      UserIsTypingAQuery: 'typing'
    },
    typing: {
      UserAcceptedAQuery: 'filled',
      UserClearedQuery: 'empty'
    },
    filled: {
      UserIsTypingAQuery: 'typing',
      UserFocusedSearchBox: 'focused',
      UserClearedQuery: 'empty'
    },
    empty: {
      UserAcceptedAQuery: 'filled',
      UserIsTypingAQuery: 'typing'
    },
    focused: {
      UserBlurredSearchBox: 'filled',
      UserClearedQuery: 'empty',
      UserIsTypingAQuery: 'typing'
    }
  }
});

/**
 * Default implementation for the {@link SearchBoxActions.setInputStatus}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @param event - The event used to transition the state machine.
 * @public
 */
export const setInputStatus: SearchBoxXStoreModule['actions']['setInputStatus'] = (
  { commit },
  event
) => {
  machine.transition(event);
  commit('setInputStatus', machine.currentState);
};
