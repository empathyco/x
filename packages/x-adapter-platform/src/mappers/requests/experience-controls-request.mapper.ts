 
import type { ExperienceControlsRequest } from '@empathyco/x-types';
import type { PlatformExperienceControlsRequest } from '../../types/requests/experience-controls-request.model';
import { schemaMapperFactory } from '@empathyco/x-adapter';
import { experienceControlsRequestSchema } from '../../schemas/requests/experience-controls-request.schema';
 

/**
 * Default implementation for the ExperienceControlsRequestMapper.
 *
 * @public
 */
export const experienceControlsRequestMapper = schemaMapperFactory<
  ExperienceControlsRequest,
  PlatformExperienceControlsRequest
>(experienceControlsRequestSchema);
