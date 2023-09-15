import { XEventsTypes } from '../../wiring';

/**
 * Dictionary of the events of Experience Controls XModule.
 *
 * @public
 */
export interface ExperienceControlsXEvents {
  /**
   * The experience-controls-events closed following its events configuration.
   * * Payload: none.
   */
  ExperienceControlsClosed: Partial<XEventsTypes>;
}
