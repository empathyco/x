// eslint-disable-next-line max-len
import { createMutableSchema } from '@empathyco/x-adapter';
// eslint-disable-next-line max-len
import { ExperienceControlsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { PlatformExperienceControlsRequest } from '../../types/requests/experience-controls-request.model';

export const experienceControlsRequestSchema = createMutableSchema<
  ExperienceControlsRequest,
  PlatformExperienceControlsRequest
>({
  extraParams: 'extraParams'
});
