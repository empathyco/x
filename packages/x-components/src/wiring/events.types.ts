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
}

export type XEvent = keyof XEventsTypes;
export type XEventPayload<E extends XEvent> = XEventsTypes[E];
