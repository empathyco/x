import type { ExperienceControlsRequest } from '@empathyco/x-types'
import type { ExperienceControlsState } from '.'
import type { XEventsTypes } from '../../wiring'

/**
 * Dictionary of the events of Experience Controls XModule.
 *
 * @public
 */
export interface ExperienceControlsXEvents {
  ExperienceControlsEventsChanged: Partial<XEventsTypes>
  ExperienceControlsRequestUpdated: ExperienceControlsRequest | null
  ExperienceControlsChanged: ExperienceControlsState
}
