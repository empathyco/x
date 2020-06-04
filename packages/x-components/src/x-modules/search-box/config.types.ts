import { Suggestion } from '@empathy/search-types';
import { PropsWithType } from '../../utils/types';
import { XEventsTypes } from '../../wiring/events.types';

/**
 * Search box x-module configuration.
 *
 * @public
 */
export interface SearchBoxConfig {
  /** Max characters number allowed in the input search. */
  maxLength: number;
  /** Allow input autofocus when the search box has been rendered. */
  autofocus: boolean;
  /** Enable the auto accept query after debounce. */
  instant: boolean;
  /** The debounce time for the instant. */
  instantDebounceInMs: number;
  /** Autocomplete suggestion configuration. */
  autocomplete: {
    /** Keyboard keys to accept the autocomplete suggestion. */
    keyboardKeys: string[]; // https://keycode.info/
    /** Event to retrieve the suggestion will be used to autocomplete. */
    suggestionsEvent: PropsWithType<XEventsTypes, Suggestion[]>;
  };
}
