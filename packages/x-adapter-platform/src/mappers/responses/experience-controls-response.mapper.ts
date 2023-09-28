import { schemaMapperFactory } from '@empathyco/x-adapter';
import { ExperienceControlsResponse } from '@empathyco/x-types';
import { PlatformExperienceControlsResponse } from '../../types';
// eslint-disable-next-line max-len
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
