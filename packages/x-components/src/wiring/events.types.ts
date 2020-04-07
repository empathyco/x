import { NextQueriesRequest, SuggestionsRequest } from '@empathy/search-adapter';
import { NextQuery, Suggestion, HistoryQuery } from '@empathy/search-types';
import { CurrencyOptions } from '../i18n/currency.types';
import { DocumentDirection } from '../plugins/x-plugin.types';
import { ArrowKey } from '../utils';

/**
 * Dictionary of the events of EmpathyX, where each key is the event name, and the value is the
 * event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface XEventsTypes {
  /**
   * The search adapter configuration has changed
   * * Payload: The new search adapter configuration.
   */
  AdapterConfigChanged: unknown;
  /**
   * The {@link XConfig.consent} has changed
   * * Payload: The new consent.
   */
  ConfigConsentChanged: boolean;
  /**
   * The {@link XConfig.currencyOptions} has changed
   * * Payload: The new currency.
   */
  ConfigCurrencyChanged: CurrencyOptions;
  /**
   * The {@link XConfig.documentDirection} has changed
   * * Payload: The new document direction.
   */
  ConfigDocumentDirectionChanged: DocumentDirection;
  /**
   * The query for searching inside the history-queries has changed.
   * * Payload: The history-queries query.
   */
  HistoryQueriesQueryChanged: string;
  /**
   * The current history queries have been displayed to the user.
   * * Payload: The displayed history queries.
   */
  HistoryQueriesDisplayed: HistoryQuery[];
  /**
   * Query suggestions have been changed.
   * * Payload: The new {@link @empathy/search-types#Suggestion | query suggestions}.
   */
  QuerySuggestionsChanged: Suggestion[];
  /**
   * The query suggestions have been displayed.
   * * Payload: The displayed {@link @empathy/search-types#Suggestion | query suggestions}.
   */
  QuerySuggestionsDisplayed: Suggestion[];
  /**
   * Any property of the query-suggestions request has changed.
   * * Payload: The new query suggestions request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  QuerySuggestionsRequestChanged: SuggestionsRequest | null;
  /**
   * The search-box query has changed
   * * Payload: The new search-box query.
   */
  SearchBoxQueryChanged: string;
  /**
   * Any property of the next-queries request has changed
   * * Payload: The new next-queries request or `null` if there is not enough data in the state
   * to conform a valid request.
   */
  NextQueriesRequestChanged: NextQueriesRequest | null;
  /**
   * Any property of the popular-searches request has changed
   * * Payload: The new popular-search request.
   */
  PopularSearchesRequestChanged: SuggestionsRequest;
  /**
   * The popular searches have been displayed.
   * * Payload: The displayed {@link @empathy/search-types#Suggestion | popular searches}.
   */
  PopularSearchDisplayed: Suggestion[];
  /**
   * The queries made in the current session have changed
   * * Payload: The session history queries.
   */
  SessionHistoryQueriesChanged: HistoryQuery[];
  /**
   * Any kind of suggestions have been displayed (query-suggestions, popular searches...)
   * * Payload: The displayed {@link @empathy/search-types#Suggestion | suggestions}.
   */
  SuggestionsDisplayed: Suggestion[];
  /**
   * The user has accepted a query
   * * Payload: the accepted query.
   */
  UserAcceptedAQuery: string;
  /**
   * The user removed the focus from the search-box.
   * * Payload: none.
   */
  UserBlurredSearchBox: void;
  /**
   * The user focused the search-box
   * * Payload: none.
   */
  UserFocusedSearchBox: void;
  /**
   * The user is typing/pasting a query
   * * Payload: the partial query that the user is typing.
   */
  UserIsTypingAQuery: string;
  /**
   * The user pressed the search button
   * * Payload: The query to search.
   */
  UserPressedSearchButton: string;
  /**
   * The user triggered the button that clears the search-box
   * * Payload: none.
   */
  UserPressedClearSearchBoxButton: void;
  /**
   * The user pressed the button for clearing all the history queries.
   * * Payload: none.
   */
  UserPressedClearHistoryQueries: void;
  /**
   * The user pressed the enter key with the focus on the search-box
   * * Payload: the new query of the search-box.
   */
  UserPressedEnterKey: string;
  /**
   * The user pressed an {@link ArrowKey | arrow key} with the focus on the search-box.
   * * Payload: the pressed {@link ArrowKey | arrow key}.
   */
  UserPressedArrowKey: ArrowKey;
  /**
   * The user pressed the button for deleting a single
   * {@link @empathy/search-types#HistoryQuery | history query}.
   * * Payload: The history query to delete.
   */
  UserPressedDeleteHistoryQuery: HistoryQuery;
  /**
   * The user has selected a history-query.
   * * Payload: The {@link @empathy/search-types#HistoryQuery | history query} selected.
   */
  UserSelectedAHistoryQuery: HistoryQuery;
  /**
   * The user has selected a next-query
   * * Payload: The next query that has been selected by the user.
   */
  UserSelectedANextQuery: NextQuery;
  /**
   * User selected a popular search
   * * Payload: The popular search that the user selected.
   */
  UserSelectedAPopularSearch: Suggestion;
  /**
   * User selected any kind of suggestion (query-suggestion, popular-search...)
   * * Payload: The {@link @empathy/search-types#Suggestion | suggestion} that the user selected.
   */
  UserSelectedASuggestion: Suggestion;
  /**
   * User selected a query suggestion
   * * Payload: The {@link @empathy/search-types#Suggestion | query suggestion} that the user
   * selected.
   */
  UserSelectedAQuerySuggestion: Suggestion;
  /**
   * The user voiced a query
   * * Payload: The spoken query.
   */
  UserTalked: string;
}

/**
 * Name of all available events.
 *
 * @public
 */
export type XEvent = keyof XEventsTypes;

/**
 * Extracts the payload type of an event.
 *
 * @typeParam Event - The {@link XEvent} to extract its payload type
 * @public
 */
export type XEventPayload<Event extends XEvent> = XEventsTypes[Event] extends void
  ? undefined
  : XEventsTypes[Event];
