import { Subject } from 'rxjs';
import { Store } from 'vuex';
import { XBus } from '../plugins/x-bus.types';
import { RootXStoreState } from '../store/store.types';
import { MaybeArray } from '../utils/types';
import { XEvent } from './events.types';
import { TimeSelector } from './wiring.types';

/**
 * Creates the observable for the events that will be racing the wire's execution.
 *
 * @param raceEvent - The event or events that would prevent the wire execution if at least one
 * of them executes first.
 * @param on - The on function of the {@link XBus} where the events will run.
 * @returns The observable for the racing events.
 * @internal
 */
export function mergeEvents(raceEvent: MaybeArray<XEvent>, on: XBus['on']): Subject<void> {
  const raceObservable = new Subject<void>();
  const raceEvents = Array.isArray(raceEvent) ? raceEvent : [raceEvent];

  /* Can't use RxJS `merge` function, as it immediately emits previously emitted values to new
   subscriptions due to the `ReplaySubject` of the bus. With this Subject we are still receiving
   those values immediately on subscription, but as there are no subscribers before the `return`
   happens we are fine. */
  raceEvents.forEach(raceEvent => on(raceEvent).subscribe(() => raceObservable.next()));
  return raceObservable;
}

/**
 * Checks how to retrieve the timeout time, retrieves it and returns it in ms.
 *
 * @param timeInMs - Time for the timeout in ms.
 * @param store - The store of the wire that will be timed out.
 * @returns The time in ms for the timeout.
 * @internal
 */
export function normalizeTime(
  timeInMs: TimeSelector | number,
  store: Store<RootXStoreState>
): number {
  return typeof timeInMs === 'function' ? timeInMs(store) : timeInMs;
}
