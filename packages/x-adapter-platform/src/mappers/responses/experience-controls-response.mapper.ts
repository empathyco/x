import { schemaMapperFactory } from '@empathyco/x-adapter';
import { ExperienceControlsResponse } from '@empathyco/x-types';
import { PlatformExperienceControlsResponse } from '../../types';
import { experienceControlsSchema } from '../../schemas/models/experience-controls.schema';

/**
 * Default implementation for the NextQueriesResponseMapper.
 *
 * @public
 */
export const experienceControlsResponseMapper = schemaMapperFactory<
  PlatformExperienceControlsResponse,
  ExperienceControlsResponse
>(experienceControlsSchema);
