import type { ExperienceControlsResponse } from '@empathyco/x-types'
import { createTransformSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the ExperienceControlsResponseSchema.
 *
 * @public
 */
export const experienceControlsResponseSchema = createTransformSchema<
  Record<string, unknown>,
  ExperienceControlsResponse
>({
  transform: (response): ExperienceControlsResponse => ({
    controls: response,
    events: {},
  }),
})
