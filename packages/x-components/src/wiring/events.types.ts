import type { Result, ResultVariant, Suggestion } from '@empathyco/x-types'
import type { ComputedRef } from 'vue'
import type { ExtractPayload } from '../store/store.types'
import type { ArrowKey, PropsWithType } from '../utils'
import type { AiXEvents } from '../x-modules/ai'
import type { DeviceXEvents } from '../x-modules/device'
import type { EmpathizeXEvents } from '../x-modules/empathize/events.types'
import type { ExperienceControlsXEvents } from '../x-modules/experience-controls/events.types'
import type { ExtraParamsXEvents } from '../x-modules/extra-params'
import type { FacetsXEvents } from '../x-modules/facets/events.types'
import type { HistoryQueriesXEvents } from '../x-modules/history-queries/events.types'
import type { IdentifierResultsXEvents } from '../x-modules/identifier-results/events.types'
import type { NextQueriesXEvents } from '../x-modules/next-queries/events.types'
import type { PopularSearchesXEvents } from '../x-modules/popular-searches/events.types'
import type { QueriesPreviewXEvents } from '../x-modules/queries-preview/events.types'
import type { QuerySuggestionsXEvents } from '../x-modules/query-suggestions/events.types'
import type { RecommendationsXEvents } from '../x-modules/recommendations/events.types'
import type { RelatedPromptsXEvents } from '../x-modules/related-prompts/events.types'
import type { RelatedTagsXEvents } from '../x-modules/related-tags/events.types'
import type { ScrollXEvents } from '../x-modules/scroll/events.types'
import type { SearchBoxXEvents } from '../x-modules/search-box/events.types'
import type { SearchXEvents } from '../x-modules/search/events.types'
import type { SemanticQueriesXEvents } from '../x-modules/semantic-queries/events.types'
import type { TaggingXEvents } from '../x-modules/tagging/events.types'
import type { UrlXEvents } from '../x-modules/url/events.types'
import type { XModuleName } from '../x-modules/x-modules.types'
import type { WireMetadata } from './wiring.types'

/**.
 * Dictionary of all the {@link XEvent | XEvents}, where each key is the event name, and the value
 * is the event payload type or `void` if it has no payload. All the events listed in this file are
 * common to all X components modules, so they might be fired by components of any module.
 *
 *
 * @remarks
 * Aside from common events, this interface also extends the different XModule's XEventsTypes. If
 * you arrived here from eDocs portal, please find the event you are looking for in the specific
 * module. In the following links you will find the events that are special for each module:
 *
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/device/events.types.ts | DeviceXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/empathize/events.types.ts | EmpathizeXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/facets/events.types.ts | FacetsXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/history-queries/events.types.ts | HistoryQueriesXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/identifier-results/events.types.ts | IdentifierResultsXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/next-queries/events.types.ts | NextQueriesXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/popular-searches/events.types.ts | PopularSearchesXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/queries-preview/events.types.ts | QueriesPreviewXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/query-suggestions/events.types.ts | QuerySuggestionsXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/recommendations/events.types.ts | RecommendationsXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/related-tags/events.types.ts | RelatedTagsXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/scroll/events.types.ts | ScrollXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/search-box/events.types.ts | SearchBoxXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/search/events.types.ts | SearchXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/tagging/events.types.ts | TaggingXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/url/events.types.ts | UrlXEvents}
 * {@link https://github.com/empathyco/x/blob/main/packages/x-components/src/x-modules/related-prompts/events.types.ts | RelatedPromptsXEvents}
 *
 * @public
 */
export interface XEventsTypes
  extends DeviceXEvents,
    EmpathizeXEvents,
    ExtraParamsXEvents,
    FacetsXEvents,
    HistoryQueriesXEvents,
    IdentifierResultsXEvents,
    NextQueriesXEvents,
    PopularSearchesXEvents,
    QueriesPreviewXEvents,
    QuerySuggestionsXEvents,
    RecommendationsXEvents,
    RelatedTagsXEvents,
    ScrollXEvents,
    SearchBoxXEvents,
    SearchXEvents,
    SemanticQueriesXEvents,
    TaggingXEvents,
    ExperienceControlsXEvents,
    UrlXEvents,
    RelatedPromptsXEvents,
    AiXEvents {
  /**
   * The provided number of columns of a grid has changed.
   * Payload: the columns number.
   */
  ColumnsNumberProvided: number
  /**
   * The rendered number of columns of a grid has changed.
   * Payload: the columns number.
   */
  RenderedColumnsNumberChanged: number
  /**
   * Any kind of suggestions have been displayed (query-suggestions, popular searches...)
   * Payload: The displayed {@link @empathyco/x-types#Suggestion | suggestions}.
   */
  SuggestionsDisplayed: Suggestion[]
  /**
   * The `BaseToggleIdPanel` `isOpen` state changed.
   * Payload: the new state.
   */
  TogglePanelStateChanged: boolean
  /**
   * The user has accepted a query
   * Payload: the accepted query.
   */
  UserAcceptedAQuery: string
  /**
   * The user has accepted the spellcheck
   * Payload: the spellcheck query.
   */
  UserAcceptedSpellcheckQuery: string
  /**
   * The user has clicked on a result.
   * Payload: The {@link @empathyco/x-types#Result | result} that the user clicked.
   */
  UserClickedAResult: Result
  /**
   * The user has clicked on a display result.
   * Payload: The {@link @empathyco/x-types#Result | result} that the user clicked.
   */
  UserClickedADisplayResult: Result
  /**
   * The user clicked the button to close the events modal.
   * Payload: none.
   */
  UserClickedCloseEventsModal: void
  /**
   * The user clicked the button to close a modal.
   * Payload: the id of the modal to close.
   */
  UserClickedCloseModal: string
  /**
   * The user clicked the button to close X.
   * Payload: none.
   */
  UserClickedCloseX: void
  /**
   * The user clicked out of the main modal.
   * Payload: none.
   */
  UserClickedOutOfMainModal: void
  /**
   * The user clicked the button to select the number of columns.
   * Payload: the column number.
   */
  UserClickedColumnPicker: number
  /**
   * The user clicked the button to open the events modal.
   * Payload: none.
   */
  UserClickedOpenEventsModal: void
  /**
   * The user clicked the button to open a modal.
   * Payload: the id of the modal to open.
   */
  UserClickedOpenModal: string
  /**
   * The user clicked the button to open X.
   * Payload: none.
   */
  UserClickedOpenX: void
  /**
   * The user clicked out of the events modal while it is opened.
   * Payload: none.
   */
  UserClickedOutOfEventsModal: void
  /**
   * The user clicked out of a modal while it was opened.
   * Payload: the id of the modal.
   */
  UserClickedOutOfModal: string
  /**
   * The user clicked the button to toggle a panel.
   * Payload: the id of the panel to toggle.
   */
  UserClickedPanelToggleButton: string
  /**
   * The user has clicked on the add to cart button of a result.
   * Payload: The {@link @empathyco/x-types#Result | result} that the user clicked.
   */
  UserClickedResultAddToCart: Result
  /**
   * The user has clicked on the rating of a result.
   * Payload: The {@link @empathyco/x-types#Result | result} that the user clicked.
   */
  UserClickedAResultRating: Result
  /**
   * The user has clicked the scroll to top button.
   * Payload: The scroll id which has scrolled to top.
   */
  UserClickedScrollToTop: string
  /**
   * The user opened X programmatically.
   * Payload: none.
   */
  UserOpenXProgrammatically: void
  /**
   * The user pressed an {@link ArrowKey | arrow key} with the focus on the search-box.
   * Payload: the pressed {@link ArrowKey | arrow key}.
   */
  UserPressedArrowKey: ArrowKey
  /**
   * The user has reached the top of the empathize and keeps navigating in that direction.
   * Payload: none.
   */
  UserReachedEmpathizeTop: void
  /**
   * The user selected a result variant.
   * Payload: And object containing the result, the selected variant, the level of the selected
   * variant and the query preview hash.
   */
  UserSelectedAResultVariant: {
    result: Result
    variant: ResultVariant
    level: number
    queryPreviewHash: ComputedRef<string> | null
  }
  /**
   * User selected any kind of suggestion (query-suggestion, popular-search...)
   * Payload: The {@link @empathyco/x-types#Suggestion | suggestion} that the user selected.
   */
  UserSelectedASuggestion: Suggestion
  /**
   * A callback from the snippet has been executed.
   * Payload: An object containing the event that executed the callback, the callback result, and
   * the original event payload and  metadata.
   */
  SnippetCallbackExecuted: {
    event: XEvent
    callbackReturn: unknown
    payload: ExtractPayload<XEvent>
    metadata: WireMetadata
  }
  /**
   * A new {@link XModule} has been registered.
   * Payload: The name of the XModule that has been registered.
   */
  ModuleRegistered: XModuleName
}

/**
 * Name of all available events.
 *
 * @public
 */
export type XEvent = keyof XEventsTypes

/**
 * Selects events of the with a payload matching the provided type.
 *
 * @typeParam Type - The type that events payload should match.
 * @public
 */
export type XEventsOf<Type> = PropsWithType<XEventsTypes, Type>

/**
 * Extracts the payload type of an event.
 *
 * @typeParam Event - The {@link XEvent} to extract its payload type
 * @public
 */
export type XEventPayload<Event extends XEvent> = XEventsTypes[Event] extends void
  ? undefined
  : XEventsTypes[Event]
