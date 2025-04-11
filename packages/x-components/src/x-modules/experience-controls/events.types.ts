import type { ExperienceControlsRequest } from '@empathyco/x-types'
import type { XEventsTypes } from '../../wiring'

/**
 * Dictionary of the events of Experience Controls XModule.
 *
 * @public
 */
export interface ExperienceControlsXEvents {
  ExperienceControlsEventsChanged: Partial<XEventsTypes>
  ExperienceControlsRequestUpdated: ExperienceControlsRequest | null
}
