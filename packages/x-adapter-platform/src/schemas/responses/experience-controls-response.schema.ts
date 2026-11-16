import type { ExperienceControlsResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'

/**
 * Default implementation for the ExperienceControlsResponseSchema.
 *
 * @public
 */
export const experienceControlsResponseSchema = createMutableZodSchema<
  Record<string, unknown>,
  ExperienceControlsResponse
>({
  transform: (response): ExperienceControlsResponse => ({
    controls: response,
    events: {},
  }),
})
