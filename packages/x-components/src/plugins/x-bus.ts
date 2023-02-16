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
    UserScrolledToElement: 0,
    RequestUpdated: 2,
    Changed: 4,
    User: 6,
    FromUrl: 8,
    External: 10,
    Provided: 12,
    BeforeCrateHook: 12,
    CreatedHook: 12,
    BeforeMountHook: 12,
    MountedHook: 12,
    BeforeUpdateHook: 12,
    UpdatedHook: 12,
    BeforeUnmountHook: 12,
    UnmountedHook: 12,
    DataReceived: 14,
    Initialized: 16
  },
  emitCallbacks: [logDevtoolsXEvent]
});
