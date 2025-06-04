import type { Observable } from 'rxjs'
import type { Store } from 'vuex'
import type { RootXStoreState } from '../store/store.types'
import type { MaybeArray } from '../utils/types'
import type { XBus } from '../x-bus'
import type { XEvent, XEventsTypes } from './events.types'
import type { TimedWireOperatorOptions, TimeSelector, WireMetadata } from './wiring.types'
import { race, Subject, timer } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

/**
 * Creates the observable for the events that will be racing the wire's execution.
 *
 * @param events - The events to merge its observables.
 * @param on - The on function of the XBus where the events will run.
 * @returns The observable for the racing events.
 * @internal
 */
export function mergeEvents(
  events: MaybeArray<XEvent>,
  on: XBus<XEventsTypes, WireMetadata>['on'],
): Observable<void> {
  const subject = new Subject<void>()
  const eventsList = Array.isArray(events) ? events : [events]

  /* Can't use RxJS `merge` function, as it immediately emits previously emitted values to new
   subscriptions due to the `ReplaySubject` of the bus. With this Subject we are still receiving
   those values immediately on subscription, but as there are no subscribers before the `return`
   happens we are fine. */
  eventsList.forEach(raceEvent => on(raceEvent).subscribe(() => subject.next()))
  return subject
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
  store: Store<RootXStoreState>,
): number {
  return typeof timeInMs === 'function' ? timeInMs(store) : timeInMs
}

/**
 * Creates a timer observable that depending on the provided options might be aborted or forced.
 *
 * @param durationInMs - The duration in ms for the timer.
 * @param options - Options to configure the timer, like an events to force it or cancel it.
 * @param options.cancelOn - cancelOn option.
 * @param options.forceOn - forceOn option.
 * @param on - The {@link XBus.on} method.
 * @returns A timer observable that can be aborted or forced depending on the provided options.
 * @internal
 */
export function createTimer(
  durationInMs: number,
  { cancelOn, forceOn }: TimedWireOperatorOptions,
  on: XBus<XEventsTypes, WireMetadata>['on'],
): Observable<unknown> {
  let timerObservable: Observable<unknown> = timer(durationInMs)
  if (forceOn) {
    timerObservable = race(timerObservable, mergeEvents(forceOn, on))
  }

  if (cancelOn) {
    timerObservable = timerObservable.pipe(takeUntil(mergeEvents(cancelOn, on)))
  }

  return timerObservable
}
