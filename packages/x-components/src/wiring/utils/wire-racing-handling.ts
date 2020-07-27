import { interval } from 'rxjs';
import { debounce as debounceRx, take as takeRx, throttle as throttleRx } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Store } from 'vuex';
import { XBus } from '../../plugins/x-bus.types';
import { RootXStoreState } from '../../store/store.types';
import { XEvent } from '.././events.types';
import { TimeRetrieving, Wire } from '.././wiring.types';

/**
 * Creates a {@link Wire} who's execution is timed, either by debouncing or throttling. If any of
 * the events in raceEvent are executed before the timed execution of the created wire, then this
 * wire is not executed. This is meant to prevent inconsistency issues in the store.
 *
 * @param wire - The wire to time execute.
 * @param timeInMs - The time in milliseconds to time the wire execution or a function to
 * retrieve it from the store.
 * @param timingOperatorRx - The kind of Rx operator to be used.
 * @param raceEvent - The event or events that would prevent the wire execution if at least one
 * of them executes first.
 * @returns The Wire function with a timing.
 *
 * @public
 */
export function handleTimedWire<Payload>(
  wire: Wire<Payload>,
  timeInMs: TimeRetrieving | number,
  timingOperatorRx: typeof debounceRx | typeof throttleRx,
  raceEvent: XEvent | XEvent[] = []
): Wire<Payload> {
  return (observable, store, on) => {
    const timeoutObservable = new Subject();
    let raceSubscription: Subscription;
    let timeout: ReturnType<typeof setTimeout>;
    const raceObservable = getRaceEventsObservable(raceEvent, on);

    return wire(
      isDebounceRx(timingOperatorRx)
        ? observable.pipe(
            timingOperatorRx(() => {
              const timeoutTime = getTimeoutTime(timeInMs, store);
              timeout = updateTimeout(timeout, timeoutTime, timeoutObservable);
              raceSubscription = updateRaceSubscription(raceSubscription, raceObservable, timeout);
              return timeoutObservable;
            })
          )
        : observable.pipe(
            timingOperatorRx(() => interval(getTimeoutTime(timeInMs, store)), {
              leading: true,
              trailing: true
            })
          ),
      store,
      on
    );
  };
}

/**
 * Creates the observable for the events that will be racing the wire's execution.
 *
 * @param raceEvent - The event or events that would prevent the wire execution if at least one
 * of them executes first.
 * @param on - The on function of the {@link XBus} where the events will run.
 * @returns The observable for the racing events.
 */
function getRaceEventsObservable(
  raceEvent: XEvent | XEvent[] = [],
  on: XBus['on']
): Subject<unknown> {
  const raceObservable = new Subject();
  const raceEvents = Array.isArray(raceEvent) ? raceEvent : [raceEvent];

  /* It creates a custom merged observable instead of using the `merge` RxJS utility function.
   We can't use the `merge` function here because our bus uses `ReplaySubject` which emits old
   values to the new subscribers and the RxJS timing operator would be canceled by the
   `raceEvent` if it was triggered before the event with a debounced wire */
  raceEvents.forEach(raceEvent => on(raceEvent).subscribe(() => raceObservable.next()));
  return raceObservable;
}

/**
 * Clears the current timeout and sets a new one with a new time.
 *
 * @param timeout - The current timeout.
 * @param timeoutTime - The timeout time in ms.
 * @param timeoutObservable - Observable for the emitting events.
 * @returns The new timeout id.
 *
 * @remarks Due to the setTimeout function being 'duplicated' by the browser and Node.js, we
 * have to infer the type from the function itself to about typing issues and allow SSR
 * integration.
 */
function updateTimeout(
  timeout: ReturnType<typeof setTimeout>,
  timeoutTime: number,
  timeoutObservable: Subject<unknown>
): ReturnType<typeof setTimeout> {
  clearTimeout(timeout);
  return setTimeout(() => timeoutObservable.next(), timeoutTime);
}

/**
 * Checks how to retrieve the timeout time, retrieves it and returns it in ms.
 *
 * @param timeInMs - Time for the timeout in ms.
 * @param store - The store of the wire that will be timed out.
 * @returns The time in ms for the timeout.
 */
function getTimeoutTime(timeInMs: TimeRetrieving | number, store: Store<RootXStoreState>): number {
  return typeof timeInMs === 'function' ? timeInMs(store) : timeInMs;
}

/**
 * Unsubscribes from the current raceSubscription, sets it to take a new event and re-subscribes
 * to the raceObservable.
 *
 * @param raceSubscription - The subscription for the racing events.
 * @param raceObservable - The observable of the racing events.
 * @param timeout - The current timeout.
 * @returns The new raceSubscription.
 */
function updateRaceSubscription(
  raceSubscription: Subscription,
  raceObservable: Subject<unknown>,
  timeout: ReturnType<typeof setTimeout>
): Subscription {
  raceSubscription?.unsubscribe();
  return raceObservable.pipe(takeRx(1)).subscribe(() => clearTimeout(timeout));
}

/**
 * Check if the RxJS timing operator provided is a debounce.
 *
 * @param timingOperatorRx - The kind of Rx operator to be checked.
 * @returns If the timing operator provided is a debounce.
 */
function isDebounceRx(
  timingOperatorRx: typeof debounceRx | typeof throttleRx
): timingOperatorRx is typeof debounceRx {
  return timingOperatorRx === debounceRx;
}
