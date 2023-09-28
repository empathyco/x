import { Dictionary } from '@empathyco/x-utils';

/**
 * Response for the `experience controls` endpoint.
 *
 * @public
 */
export interface PlatformExperienceControlsResponse {
  controls: Dictionary;
  events: Dictionary;
}
