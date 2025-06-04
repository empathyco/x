import type { XEventsTypes } from '../wiring/events.types'
import type { WireMetadata } from '../wiring/wiring.types'
import { XPriorityBus } from '../x-bus'
import { logDevtoolsXEvent } from './devtools/timeline.devtools'

/**
 * Default XBus implementation.
 *
 * @public
 */
export const bus = new XPriorityBus<XEventsTypes, WireMetadata>({
  priorities: {
    Updated: 2,
    Changed: 4,
    FromUrl: 8,
    User: 16,
    External: 32,
    Initialized: 64,
    Provided: 128,
    DataReceived: 256,
    ModuleRegistered: 512,
  },
  emitCallbacks: [logDevtoolsXEvent],
})
