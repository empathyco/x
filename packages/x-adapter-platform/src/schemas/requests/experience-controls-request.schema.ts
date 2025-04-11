import type { ExperienceControlsRequest } from '@empathyco/x-types'
import type { PlatformExperienceControlsRequest } from '../../types/requests/experience-controls-request.model'

import { createMutableSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the ExperienceControlsRequestSchema.
 *
 * @public
 */
export const experienceControlsRequestSchema = createMutableSchema<
  ExperienceControlsRequest,
  PlatformExperienceControlsRequest
>({
  extraParams: 'extraParams',
})
