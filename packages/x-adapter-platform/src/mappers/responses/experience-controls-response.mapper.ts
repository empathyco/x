import type { ExperienceControlsResponse } from '@empathyco/x-types';
import type { PlatformExperienceControlsResponse } from '../../types';
 
import { schemaMapperFactory } from '@empathyco/x-adapter';
import { experienceControlsResponseSchema } from '../../schemas/responses/experience-controls-response.schema';

/**
 * Default implementation for the ExperienceControlsResponseMapper.
 *
 * @public
 */
export const experienceControlsResponseMapper = schemaMapperFactory<
  PlatformExperienceControlsResponse,
  ExperienceControlsResponse
>(experienceControlsResponseSchema);
