import { Dictionary } from '@empathyco/x-utils';
/**
 * Response for the experience controls endpoint.
 *
 * @public
 */
export interface ExperienceControlsResponse {
  controls: Dictionary;
  events: Dictionary;
}
