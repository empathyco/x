import type { ExperienceControlsResponse } from '@empathyco/x-types'
import type { PlatformExperienceControlsResponse } from '../../types'
import { z } from 'zod'

/**
 * Default implementation for the ExperienceControlsResponseSchema.
 *
 * @public
 */
export const experienceControlsResponseSchema = z.any().transform(
  (source): ExperienceControlsResponse => ({
    controls: source as PlatformExperienceControlsResponse,
    events: {},
  }),
)
