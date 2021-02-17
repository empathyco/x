import { Result, Suggestion } from '@empathy/search-types';
import { DocumentDirection } from '../plugins/x-plugin.types';
import { ArrowKey, PropsWithType } from '../utils';
import { EmpathizeXEvents } from '../x-modules/empathize/events.types';
import { FacetsXEvents } from '../x-modules/facets/events.types';
import { HistoryQueriesXEvents } from '../x-modules/history-queries/events.types';
import { IdentifierResultsXEvents } from '../x-modules/identifier-results/events.types';
import { NextQueriesXEvents } from '../x-modules/next-queries/events.types';
import { PopularSearchesXEvents } from '../x-modules/popular-searches/events.types';
import { QuerySuggestionsXEvents } from '../x-modules/query-suggestions/events.types';
import { RecommendationsXEvents } from '../x-modules/recommendations/events.types';
import { RelatedTagsXEvents } from '../x-modules/related-tags/events.types';
import { SearchBoxXEvents } from '../x-modules/search-box/events.types';
import { SearchXEvents } from '../x-modules/search/events.types';

/**
 * Dictionary of all the {@link XEvent | XEvents}, where each key is the event name, and the value
 * is the event payload type or `void` if it has no payload.
 *
 * @remarks
 * Aside from common {@link XEvent | XEvents}, this interface also extends the different XModule's
 * XEventsTypes:
 * * {@link EmpathizeXEvents}
 * * {@link FacetsXEvents}
 * * {@link HistoryQueriesXEvents}
 * * {@link IdentifierResultsXEvents}
 * * {@link NextQueriesXEvents}
 * * {@link PopularSearchesXEvents}
 * * {@link QuerySuggestionsXEvents}
 * * {@link RecommendationsXEvents}
 * * {@link RelatedTagsXEvents}
 * * {@link SearchBoxXEvents}
 *
 * @public
 */
export interface XEventsTypes
  extends EmpathizeXEvents,
    FacetsXEvents,
    HistoryQueriesXEvents,
    IdentifierResultsXEvents,
    NextQueriesXEvents,
    PopularSearchesXEvents,
    QuerySuggestionsXEvents,
    SearchXEvents,
    SearchBoxXEvents,
    RecommendationsXEvents,
    RelatedTagsXEvents {
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
   * The {@link XConfig.documentDirection} has changed
   * * Payload: The new document direction.
   */
  ConfigDocumentDirectionChanged: DocumentDirection;
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
   * The user has clicked on a result.
   * * Payload: The {@link @empathy/search-types#Result | result} that the user clicked.
   */
  UserClickedAResult: Result;
  /**
   * The user has clicked on the add to cart button of a result.
   * * Payload: The {@link @empathy/search-types#Result | result} that the user clicked.
   */
  UserClickedResultAddToCart: Result;
  /**
   * The user clicked the button to close the XComponents modal.
   * * Payload: none.
   */
  UserClickedCloseX: void;
  /**
   * The user clicked the button to open the XComponents modal.
   * * Payload: none.
   */
  UserClickedOpenX: void;
  /**
   * The user clicked out of the X Modal while it is opened.
   * * Payload: none.
   */
  UserClickedOutOfXModal: void;
  /**
   * The user clicked the button to open a modal.
   * * Payload: the id of the modal to open.
   */
  UserClickedOpenModal: string;
  /**
   * The user clicked the button to close a modal.
   * * Payload: the id of the modal to close.
   */
  UserClickedCloseModal: string;
  /**
   * The user clicked out of a modal while it was opened.
   * * Payload: the id of the modal.
   */
  UserClickedOutOfModal: string;
  /**
   * The user pressed an {@link ArrowKey | arrow key} with the focus on the search-box.
   * * Payload: the pressed {@link ArrowKey | arrow key}.
   */
  UserPressedArrowKey: ArrowKey;
  /**
   * The user has reached the top of the empathize and keeps navigating in that direction.
   * * Payload: none.
   */
  UserReachedEmpathizeTop: void;
  /**
   * The user has right clicked on a result.
   * * Payload: The {@link @empathy/search-types#Result | result} that the user right clicked.
   */
  UserRightClickedAResult: Result;
  /**
   * User selected any kind of suggestion (query-suggestion, popular-search...)
   * * Payload: The {@link @empathy/search-types#Suggestion | suggestion} that the user selected.
   */
  UserSelectedASuggestion: Suggestion;
}

/**
 * Name of all available events.
 *
 * @public
 */
export type XEvent = keyof XEventsTypes;

/**
 * Selects events of the with a payload matching the provided type.
 *
 * @typeParam Type - The type that events payload should match.
 * @public
 */
export type XEventsOf<Type> = PropsWithType<XEventsTypes, Type>;

/**
 * Extracts the payload type of an event.
 *
 * @typeParam Event - The {@link XEvent} to extract its payload type
 * @public
 */
export type XEventPayload<Event extends XEvent> = XEventsTypes[Event] extends void
  ? undefined
  : XEventsTypes[Event];
