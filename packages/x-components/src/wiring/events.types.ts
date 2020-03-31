import { NextQueriesRequest, SuggestionsRequest } from '@empathy/search-adapter';
import { NextQuery, Suggestion } from '@empathy/search-types';
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
   * Query suggestions have been changed.
   * * Payload: The new {@link @empathy/search-types#Suggestion | query suggestions}.
   */
  QuerySuggestionsChanged: Suggestion[];
  /**
   * The query suggestions have been shown.
   * * Payload: The shown {@link @empathy/search-types#Suggestion | query suggestions}.
   */
  QuerySuggestionsShown: Suggestion[];
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
   * Any kind of suggestions have been displayed (query-suggestions, popular searches...)
   * * Payload: The shown {@link @empathy/search-types#Suggestion | suggestions}.
   */
  SuggestionsShown: Suggestion[];
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
   * The user has selected a next-query
   * * Payload: The next query that has been selected by the user.
   */
  UserSelectedANextQuery: NextQuery;
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
   * User selected a popular suggestion
   * * Payload: The suggestion that the user selected.
   */
  UserSelectedAPopularSearch: Suggestion;
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
