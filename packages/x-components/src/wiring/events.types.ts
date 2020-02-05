/**
 * Dictionary of the events of EmpathyX, where each key is the event name, and the value is the event payload type or `void` if it
 * has no payload.
 */
export interface XEventsTypes {
  /**
   * The user has manually modified the search-box (typing, pasting some text...)
   */
  UserTyped: string;
  /**
   * The user is in the process of changing a query
   */
  UserIsChangingQuery: string;
  /**
   * The user has selected or confirmed a query
   */
  UserSelectedAQuery: string;
  /**
   * The user triggered the button that clears the search-box
   */
  UserPressedClearSearchBoxButton: void;
  /**
   * The search-box query has changed
   */
  SearchBoxQueryChanged: string;
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
