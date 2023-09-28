import { createMutableSchema } from '@empathyco/x-adapter';
import { ExperienceControlsResponse } from '@empathyco/x-types';
import { PlatformExperienceControlsResponse } from '../../types';

/**
 * Default implementation for the ExperienceControlsResponseSchema.
 *
 * @public
 */
export const experienceControlsResponseSchema = createMutableSchema<
  PlatformExperienceControlsResponse,
  ExperienceControlsResponse
>({
  controls: response => response,
  events: {}
});
