/**
 * Dictionary of the events of Empathize XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface EmpathizeXEvents {
  /**
   * The user opened empathize.
   * * Payload: none.
   */
  UserOpenedEmpathize: void;
  /**
   * The user closed the empathize.
   * * Payload: none.
   */
  UserClosedEmpathize: void;
}
