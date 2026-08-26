import type { PlatformExperienceControlsRequest } from '../../types/requests/experience-controls-request.model'
import { z } from 'zod'

/**
 * Default implementation for the ExperienceControlsRequestSchema.
 *
 * @public
 */
export const experienceControlsRequestSchema = z
  .object({
    extraParams: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()
  .transform(
    (source): PlatformExperienceControlsRequest => ({
      extraParams: source.extraParams,
    }),
  )
