import type { ExperienceControlsRequest } from '@empathyco/x-types'
import type { PlatformExperienceControlsRequest } from '../../types/requests/experience-controls-request.model'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import { defined } from '../utils'

/**
 * Default implementation for the ExperienceControlsRequestSchema.
 *
 * @remarks The request is created by our own code, so it is not validated.
 * @public
 */
export const experienceControlsRequestSchema = createMutableZodSchema<
  ExperienceControlsRequest,
  PlatformExperienceControlsRequest
>({
  transform: (source): PlatformExperienceControlsRequest =>
    defined<PlatformExperienceControlsRequest>({
      extraParams: source.extraParams,
    }),
})
