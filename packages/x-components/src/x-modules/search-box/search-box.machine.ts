import { Machine } from '../../services/services.types';
import { XEvent } from '../../wiring/events.types';
import { Status } from './store/types';

/**
 * State machine that defines the different states through which the search box
 * can transition.
 */
export const SearchBoxMachine: Machine<Status, XEvent> = {
  initial: 'initial',
  states: {
    initial: {
      UserAcceptedAQuery: 'filled',
      UserIsTypingAQuery: 'typing'
    },
    typing: {
      UserIsTypingAQuery: 'typing',
      UserAcceptedAQuery: 'filled',
      UserClearedQuery: 'empty'
    },
    filled: {
      UserFocusedSearchBox: 'focused',
      UserClearedQuery: 'empty'
    },
    empty: {
      UserAcceptedAQuery: 'filled',
      UserIsTypingAQuery: 'typing'
    },
    focused: {
      UserBlurredSearchBox: 'filled',
      UserClearedQuery: 'empty'
    }
  }
};
