/**
 * Dictionary of the events of EmpathyX, where each key is the event name, and the value is the event payload type or `void` if it
 * has no payload.
 */
import { SuggestionsRequest } from '@empathy/search-adapter';
import { Suggestion } from '@empathy/search-types';

export interface XEventsTypes {
  /**
   * The search-box query has changed
   * Payload: The new search-box query
   */
  SearchBoxQueryChanged: string;
  /**
   * Any property of the term-suggestions requests has changed
   * Payload: The new suggestions request of type {@link SuggestionsRequest} or `null`
   * if there is not enough data in the state to conform a valid request
   */
  TermSuggestionsRequestChanged: SuggestionsRequest | null;
  /**
   * The user is in the process of changing a query
   * Payload: the partial query that the user is writing
   */
  UserIsChangingQuery: string;
  /**
   * The user triggered the button that clears the search-box
   * Payload: none
   */
  UserPressedClearSearchBoxButton: void;
  /**
   * User has focus on the search-box and pressed the enter key
   * Payload: The new query of the search-box
   */
  UserPressedEnter: string;
  /**
   * The user has selected or confirmed a query
   * Payload: the query that the user selected
   */
  UserSelectedAQuery: string;
  /**
   * User selected any kind of suggestion (term-suggestion, popular-search...)
   * Payload: The suggestion that the user selected
   */
  UserSelectedASuggestion: Suggestion;
  /**
   * User selected a term suggestion
   * Payload: The suggestion that the user selected
   */
  UserSelectedATermSuggestion: Suggestion;
  /**
   * The user has manually modified the search-box (typing, pasting some text...)
   * Payload: the query that the user is writing in the search-box
   */
  UserTyped: string;
}

/**
 * Name of all available events
 */
export type XEvent = keyof XEventsTypes;

/**
 * Extracts the payload type of an event
 * @param E The {@link XEvent} to extract its payload type
 */
export type XEventPayload<E extends XEvent> = XEventsTypes[E];
