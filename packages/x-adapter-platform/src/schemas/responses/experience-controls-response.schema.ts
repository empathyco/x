import type { ExperienceControlsResponse } from '@empathyco/x-types'
import { createMutableZodSchema } from '@empathyco/x-adapter'
import * as z from 'zod/mini'

/**
 * Default implementation for the ExperienceControlsResponseSchema.
 *
 * @public
 */
export const experienceControlsResponseSchema = createMutableZodSchema({
  source: z.record(z.string(), z.unknown()),
  transform: (response): ExperienceControlsResponse => ({
    controls: response,
    events: {},
  }),
})
