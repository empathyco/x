import type { ExperienceControlsResponse } from '@empathyco/x-types'
import type { PlatformExperienceControlsResponse } from '../../types'
import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the ExperienceControlsResponseSchema.
 *
 * @public
 */
export const experienceControlsResponseSchema = createMutableSchema<
  PlatformExperienceControlsResponse,
  ExperienceControlsResponse
>({
  controls: response => response,
  events: {},
})
