import { schemaMapperFactory } from '@empathyco/x-adapter';
// eslint-disable-next-line max-len
import { ExperienceControlsRequest } from '@empathyco/x-types/src/request/experience-controls-request.model';
// eslint-disable-next-line max-len
import { PlatformExperienceControlsRequest } from '../../types/requests/experience-controls-request.model';
// eslint-disable-next-line max-len
import { experienceControlsRequestSchema } from '../../schemas/requests/experience-controls-request.schema';

export const experienceControlsRequestMapper = schemaMapperFactory<
  ExperienceControlsRequest,
  PlatformExperienceControlsRequest
>(experienceControlsRequestSchema);
