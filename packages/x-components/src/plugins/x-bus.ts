import { XPriorityBus } from '@empathyco/x-bus';
import { XEventsTypes } from '../wiring/events.types';
import { WireMetadata } from '../wiring/wiring.types';
import { logDevtoolsXEvent } from './devtools/timeline.devtools';

/**
 * Default {@link @empathyco/x-bus#XBus} implementation.
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
    ModuleRegistered: 512
  },
  emitCallbacks: [logDevtoolsXEvent]
});
