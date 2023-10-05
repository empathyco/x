import { ExperienceControlsResponse } from '@empathyco/x-types';

/**
 * Creates a {@link @empathyco/x-types#ExperienceControlsResponse |
 * experience controls response} stub.
 *
 * @returns An experience controls stub.
 *
 * @internal
 */
export function getExperienceControlsStub(): ExperienceControlsResponse {
  return createExperienceControlsStub();
}

/**
 * Creates an experience controls response.
 *
 * @returns An experience controls response.
 */
export function createExperienceControlsStub(): ExperienceControlsResponse {
  return {
    controls: { numberOfCarousels: 10, resultsPerCarousels: 21 },
    events: { ColumnsNumberProvided: 6 }
  };
}
