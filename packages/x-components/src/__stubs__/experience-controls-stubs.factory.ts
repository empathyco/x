import type { ExperienceControlsResponse } from '@empathyco/x-types'

/**
 * Creates a an experience controls response stub.
 *
 * @returns An experience controls stub.
 *
 * @internal
 */
export function getExperienceControlsStub(): ExperienceControlsResponse {
  return createExperienceControlsStub()
}

/**
 * Creates an experience controls response.
 *
 * @returns An experience controls response.
 */
export function createExperienceControlsStub(): ExperienceControlsResponse {
  return {
    controls: { numberOfCarousels: 10, resultsPerCarousels: 21 },
    events: { ColumnsNumberProvided: 6 },
  }
}
