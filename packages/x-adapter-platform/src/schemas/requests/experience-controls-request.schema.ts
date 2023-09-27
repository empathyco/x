import { createMutableSchema } from '@empathyco/x-adapter';
import { ExperienceControlsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformExperienceControlsRequest } from '../../types/requests/experience-controls-request.model';

/**
 * Default implementation for the ExperienceControlsRequestSchema.
 *
 * @public
 */
export const experienceControlsRequestSchema = createMutableSchema<
  ExperienceControlsRequest,
  PlatformExperienceControlsRequest
>({
  extraParams: 'extraParams'
});
