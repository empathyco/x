// eslint-disable-next-line max-len
import { createMutableSchema } from '@empathyco/x-adapter';
// eslint-disable-next-line max-len
import { ExperienceControlsRequest } from '../../../../x-types/src/request/experience-controls-request.model';
// eslint-disable-next-line max-len
import { PlatformExperienceControlsRequest } from '../../types/requests/experience-controls-request.model';

export const experienceControlsRequestSchema = createMutableSchema<
  ExperienceControlsRequest,
  PlatformExperienceControlsRequest
>({
  extraParams: 'extraParams'
});
