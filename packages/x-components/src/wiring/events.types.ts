import { Result, Suggestion } from '@empathyco/x-types-old';
import { ScrollDirection } from '../components/scroll/scroll.types';
import { ArrowKey, PropsWithType } from '../utils';
import { DeviceXEvents } from '../x-modules/device';
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
 * * {@link DeviceXEvents}
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
  extends DeviceXEvents,
    EmpathizeXEvents,
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
   * The number of columns of a grid has changed.
   * * Payload: the columns number.
   */
  ColumnsNumberProvided: number;
  /**
   * Any kind of suggestions have been displayed (query-suggestions, popular searches...)
   * * Payload: The displayed {@link @empathyco/x-types-old#Suggestion | suggestions}.
   */
  SuggestionsDisplayed: Suggestion[];
  /**
   * The `BaseToggleIdPanel` `isOpen` state changed.
   * * Payload: the new state.
   */
  TogglePanelStateChanged: boolean;
  /**
   * The user has accepted a query
   * * Payload: the accepted query.
   */
  UserAcceptedAQuery: string;
  /**
   * The user has accepted the spellcheck
   * * Payload: the spellcheck query.
   */
  UserAcceptedSpellcheckQuery: string;
  /**
   * The user has almost reached the scroll end.
   * * Payload: The distance missing to end position position.
   */
  UserAlmostReachedScrollEnd: number;
  /**
   * The user has changed the direction of scroll.
   * * Payload: The new {@link ScrollDirection} when user changes scroll direction.
   */
  UserChangedScrollDirection: ScrollDirection;
  /**
   * The user has clicked on a result.
   * * Payload: The {@link @empathyco/x-types-old#Result | result} that the user clicked.
   */
  UserClickedAResult: Result;
  /**
   * The user clicked the button to close a modal.
   * * Payload: the id of the modal to close.
   */
  UserClickedCloseModal: string;
  /**
   * The user clicked the button to close the XComponents modal.
   * * Payload: none.
   */
  UserClickedCloseX: void;
  /**
   * The user clicked the button to select the number of columns.
   * * Payload: the column number.
   */
  UserClickedColumnPicker: number;
  /**
   * The user clicked the button to open a modal.
   * * Payload: the id of the modal to open.
   */
  UserClickedOpenModal: string;
  /**
   * The user clicked the button to open the XComponents modal.
   * * Payload: none.
   */
  UserClickedOpenX: void;
  /**
   * The user clicked out of a modal while it was opened.
   * * Payload: the id of the modal.
   */
  UserClickedOutOfModal: string;
  /**
   * The user clicked out of the X Modal while it is opened.
   * * Payload: none.
   */
  UserClickedOutOfXModal: void;
  /**
   * The user clicked the button to toggle a panel.
   * * Payload: the id of the panel to toggle.
   */
  UserClickedPanelToggleButton: string;
  /**
   * The user has clicked on the add to cart button of a result.
   * * Payload: The {@link @empathyco/x-types-old#Result | result} that the user clicked.
   */
  UserClickedResultAddToCart: Result;
  /**
   * The user has clicked the scroll to top button.
   * * Payload: The scroll id which has scrolled to top.
   */
  UserClickedScrollToTop: string;
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
   * The user has reached the scroll end.
   * * Payload: none.
   */
  UserReachedScrollEnd: void;
  /**
   * The user has reached the scroll start.
   * * Payload: none.
   */
  UserReachedScrollStart: void;
  /**
   * The user has right clicked on a result.
   * * Payload: The {@link @empathyco/x-types-old#Result | result} that the user right clicked.
   */
  UserRightClickedAResult: Result;
  /**
   * The user has scrolled.
   * * Payload: The new position of scroll.
   */
  UserScrolled: number;
  /**
   * User selected any kind of suggestion (query-suggestion, popular-search...)
   * * Payload: The {@link @empathyco/x-types-old#Suggestion | suggestion} that the user selected.
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
