import type { Dictionary } from '@empathyco/x-utils';

/**
 * Response for the experience controls endpoint.
 *
 * @public
 */
export interface ExperienceControlsResponse {
  controls: Dictionary<unknown>;
  events: Dictionary<unknown>;
}
