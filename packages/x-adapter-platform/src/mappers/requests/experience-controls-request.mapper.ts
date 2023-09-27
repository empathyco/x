/* eslint-disable max-len */
import { schemaMapperFactory } from '@empathyco/x-adapter';
import { ExperienceControlsRequest } from '@empathyco/x-types';
import { PlatformExperienceControlsRequest } from '../../types/requests/experience-controls-request.model';
import { experienceControlsRequestSchema } from '../../schemas/requests/experience-controls-request.schema';
/* eslint-enable max-len */

/**
 * Default mapper for the ExperienceControlsMappers.
 *
 * @public
 */
export const experienceControlsRequestMapper = schemaMapperFactory<
  ExperienceControlsRequest,
  PlatformExperienceControlsRequest
>(experienceControlsRequestSchema);
