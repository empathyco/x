import { of, race, timer } from 'rxjs';
import {
  debounce as debounceRx,
  delay,
  filter as filterRx,
  map,
  switchMap,
  switchMapTo,
  takeUntil,
  throttle as throttleRx
} from 'rxjs/operators';
import { identity } from '../utils/function';
import { XModuleName } from '../x-modules/x-modules.types';
import { mergeEvents, normalizeTime } from './wires-operators.utils';
import { TimedWireOperatorOptions, TimeSelector, Wire, WireParams } from './wiring.types';

/**
 * Creates a {@link Wire} that is only executed whenever the condition in the filterFn is true.
 *
 * @param wire - The wire to filter.
 * @param filterFn - A function which must return a boolean and that will be executed every time
 * the wire is called.
 * @returns The Wire function filter.
 *
 * @public
 */
export function filter<Payload>(
  wire: Wire<Payload>,
  filterFn: (parameters: WireParams<Payload>) => boolean
): Wire<Payload> {
  return (observable, store, on) =>
    wire(observable.pipe(filterRx(wirePayload => filterFn({ ...wirePayload, store }))), store, on);
}

/**
 * Creates a {@link Wire} that is only executed when the payload is truthy. A truthy value is
 * whatever is not a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy | falsy value}.
 *
 * @param wire - The wire to avoid executing when the payload is falsy.
 * @returns The Wire function falsy filter.
 *
 * @public
 */
export function filterFalsyPayload<Payload>(wire: Wire<Payload>): Wire<Payload> {
  return filter(wire, ({ eventPayload }) => !!eventPayload);
}

/**
 * Creates a {@link Wire} that is only executed when the payload is a
 * {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy | falsy value}.
 *
 * @param wire - The wire to avoid executing when the payload is truthy.
 * @returns The Wire function truthy filter.
 *
 * @public
 */
export function filterTruthyPayload<Payload>(wire: Wire<Payload>): Wire<Payload> {
  return filter(wire, ({ eventPayload }) => !eventPayload);
}

/**
 * Creates a {@link Wire} that is only executed if the event is emitted from a {@link XModule}
 * that is included
 * in the `whitelist` array passed as parameter.
 *
 * @param wire - The wire to filter using the whitelist.
 * @param whitelist - An array of {@link XModuleName} or null.
 * @returns The Wire function with whitelisted modules filter.
 *
 * @public
 */
export function filterWhitelistedModules<Payload>(
  wire: Wire<Payload>,
  whitelist: Array<XModuleName | null>
): Wire<Payload> {
  const whitelistSet = new Set(whitelist);
  return filter(wire, ({ metadata }) => whitelistSet.has(metadata.moduleName));
}

/**
 * Creates a {@link Wire} that is only executed if the event is emitted from a {@link XModule}
 * that is NOT included
 * in the `blacklist` array passed as parameter.
 *
 * @param wire - The wire to filter using the whitelist.
 * @param blacklist - An array of {@link XModuleName} or null.
 * @returns The Wire function with blacklisted modules filter.
 *
 * @public
 */
export function filterBlacklistedModules<Payload>(
  wire: Wire<Payload>,
  blacklist: Array<XModuleName | null>
): Wire<Payload> {
  const blacklistSet = new Set(blacklist);
  return filter(wire, ({ metadata }) => !blacklistSet.has(metadata.moduleName));
}

/**
 * Creates a debounced {@link Wire}. Being debounced means that it will only be executed after
 * the time given by `timeInMs` has passed without invoking it.
 *
 * @param wire - The wire to debounce.
 * @param timeInMs - The time in milliseconds to debounce the wire execution or a function to
 * retrieve it from the store.
 * @param options - Options to configure this wire with, like an event to force it or cancel it.
 * @returns The Wire function with a debounced timing.
 *
 * @public
 */
export function debounce<Payload>(
  wire: Wire<Payload>,
  timeInMs: TimeSelector | number,
  { cancelOn, forceOn }: TimedWireOperatorOptions = {}
): Wire<Payload> {
  return (observable, store, on) => {
    if (cancelOn || forceOn) {
      const cancelObservable = mergeEvents(cancelOn ?? [], on);
      const forceObservable = mergeEvents(forceOn ?? [], on);
      return wire(
        observable.pipe(
          switchMap(payload =>
            race(
              of(payload).pipe(switchMapTo(forceObservable, identity)),
              of(payload).pipe(delay(normalizeTime(timeInMs, store)), takeUntil(cancelObservable))
            )
          )
        ),
        store,
        on
      );
    } else {
      return wire(
        observable.pipe(debounceRx(() => timer(normalizeTime(timeInMs, store)))),
        store,
        on
      );
    }
  };
}

/**
 * Creates a throttled {@link Wire}. Being throttled means that it will only be executed once
 * every couple of milliseconds given by the `timeInMs` parameter.
 *
 * @param wire - The wire to throttle.
 * @param timeInMs - The time in milliseconds to throttle the wire execution or a function to
 * retrieve it from the store.
 * @param options - Options to configure this wire with, like an event to force it or cancel it.
 * @returns The Wire function with a throttle timing.
 *
 * @public
 */
export function throttle<Payload>(
  wire: Wire<Payload>,
  timeInMs: TimeSelector | number,
  { cancelOn, forceOn }: TimedWireOperatorOptions = {}
): Wire<Payload> {
  // TODO
  return (observable, store, on) => {
    if (cancelOn || forceOn) {
      const cancelObservable = mergeEvents(cancelOn ?? [], on);
      const forceObservable = mergeEvents(forceOn ?? [], on);
      return wire(
        observable.pipe(
          switchMap(payload =>
            race(
              of(payload).pipe(switchMapTo(forceObservable, identity)),
              of(payload).pipe(delay(normalizeTime(timeInMs, store)), takeUntil(cancelObservable))
            )
          )
        ),
        store,
        on
      );
    } else {
      return wire(
        observable.pipe(throttleRx(() => timer(normalizeTime(timeInMs, store)))),
        store,
        on
      );
    }
  };
}

/**
 * Creates a {@link Wire} from other `toWire` wire. It uses `mapFn` to transform the
 * `FromPayload` received to `ToPayload` which `toWire` requires. This is
 * useful to reuse wires in different Events where the payload doesn't fit exactly.
 *
 * @param toWire - The wire which the new Wire is created from.
 * @param mapFn - Function to map the payload from `FromPayload` to `ToPayload`.
 * @returns A new {@link Wire}.
 *
 * @public
 */
export function mapWire<FromPayload, ToPayload>(
  toWire: Wire<ToPayload>,
  mapFn: (payload: FromPayload) => ToPayload
): Wire<FromPayload> {
  return (observable, ...restWireParams) =>
    toWire(
      observable.pipe(
        map(({ eventPayload, ...restWirePayload }) => ({
          eventPayload: mapFn(eventPayload),
          ...restWirePayload
        }))
      ),
      ...restWireParams
    );
}
