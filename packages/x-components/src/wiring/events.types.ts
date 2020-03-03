import { NextQueriesRequest, SuggestionsRequest } from '@empathy/search-adapter';
import { NextQuery, Suggestion } from '@empathy/search-types';

/**
 * Dictionary of the events of EmpathyX, where each key is the event name, and the value is the event payload type or `void` if it
 * has no payload.
 *
 * @public
 */
export interface XEventsTypes {
  /**
   * The search-box query has changed
   * * Payload: The new search-box query
   */
  SearchBoxQueryChanged: string;
  /**
   * Any property of the term-suggestions request has changed
   * * Payload: The new suggestions request or `null`
   * if there is not enough data in the state to conform a valid request
   */
  TermSuggestionsRequestChanged: SuggestionsRequest | null;
  /**
   * Any property of the next-queries request has changed
   * * Payload: The new next-queries request or `null`
   * if there is not enough data in the state to conform a valid request
   */
  NextQueriesRequestChanged: NextQueriesRequest | null;
  /**
   * Any property of the popular-searches request has changed
   * * Payload: The new popular-search request
   */
  PopularSearchesRequestChanged: SuggestionsRequest;
  /**
   * The user is in the process of changing a query
   * * Payload: the partial query that the user is writing
   */
  UserIsChangingQuery: string;
  /**
   * The user triggered the button that clears the search-box
   * * Payload: none
   */
  UserPressedClearSearchBoxButton: void;
  /**
   * User has focus on the search-box and pressed the enter key
   * * Payload: The new query of the search-box
   */
  UserPressedEnter: string;
  /**
   * The user has selected or confirmed a query
   * * Payload: the query that the user selected
   */
  UserSelectedAQuery: string;
  /**
   * User selected any kind of suggestion (term-suggestion, popular-search...)
   * * Payload: The suggestion that the user selected
   */
  UserSelectedASuggestion: Suggestion;
  /**
   * User selected a term suggestion
   * * Payload: The suggestion that the user selected
   */
  UserSelectedATermSuggestion: Suggestion;
  /**
   * User selected a popular suggestion
   * * Payload: The suggestion that the user selected
   */
  UserSelectedAPopularSearch: Suggestion;
  /**
   * The user has manually modified the search-box (typing, pasting some text...)
   * * Payload: the query that the user is writing in the search-box
   */
  UserTyped: string;
  /**
   * The user has selected a next-query
   * * Payload: The next query that has been selected by the user
   */
  UserSelectedANextQuery: NextQuery;
}

/**
 * Name of all available events
 *
 * @public
 */
export type XEvent = keyof XEventsTypes;

/**
 * Extracts the payload type of an event
 *
 * @typeParam Event - The {@link XEvent} to extract its payload type
 * @public
 */
export type XEventPayload<Event extends XEvent> = XEventsTypes[Event];
