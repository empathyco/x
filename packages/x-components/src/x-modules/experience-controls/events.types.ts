import type { ExperienceControlsRequest } from '@empathyco/x-types'
import type { Dictionary } from '@empathyco/x-utils'
import type { XEventsTypes } from '../../wiring'

/**
 * Dictionary of the events of Experience Controls XModule.
 *
 * @public
 */
export interface ExperienceControlsXEvents {
  ExperienceControlsEventsChanged: Partial<XEventsTypes>
  ExperienceControlsRequestUpdated: ExperienceControlsRequest | null
  ExperienceControlsChanged: Dictionary<unknown>
}
