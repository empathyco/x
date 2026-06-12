import type { ExperienceControlsRequest } from '@empathyco/x-types'
import type { XEventsTypes } from '../../wiring'
import type { ExperienceControlsState } from './store'

/**
 * Dictionary of the events of Experience Controls XModule.
 *
 * @public
 */
export interface ExperienceControlsXEvents {
  ExperienceControlsEventsChanged: Partial<XEventsTypes>
  ExperienceControlsRequestUpdated: ExperienceControlsRequest | null
  ExperienceControlsChanged: ExperienceControlsState['controls']
}
