import { createMutableSchema } from '@empathyco/x-adapter';
import { ExperienceControlsResponse } from '@empathyco/x-types';
import { PlatformExperienceControlsResponse } from '../../types';

export const experienceControlsResponseSchema = createMutableSchema<
  PlatformExperienceControlsResponse,
  ExperienceControlsResponse
>({
  numberOfCarousels: 'numberOfCarousels',
  resultsPerCarousels: 'numberOfCarousels'
});
