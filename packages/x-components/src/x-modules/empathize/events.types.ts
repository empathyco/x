/**
 * Dictionary of the events of Empathize XModule, where each key is the event name, and the value is
 * the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface EmpathizeXEvents {
  /**
   * The empathize closed following its events configuration.
   * * Payload: none.
   */
  EmpathizeClosed: void;
  /**
   * The empathize opened following its events configuration.
   * * Payload: none.
   */
  EmpathizeOpened: void;
  /**
   * The user closed the empathize.
   * * Payload: none.
   */
  UserClosedEmpathize: void;
}
