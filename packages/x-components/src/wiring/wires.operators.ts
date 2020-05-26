import { interval } from 'rxjs';
import { debounce as debounceRx, filter as filterRx, throttle as throttleRx } from 'rxjs/operators';
import { XModuleName } from '../x-modules/x-modules.types';
import { TimeRetrieving, Wire, WireParams } from './wiring.types';

/**
 * Creates a {@link Wire} that is only executed whenever the condition in the filterFn is true.
 *
 * @param wire - The wire to filter.
 * @param filterFn - A function which must return a boolean and that will be executed every time
 * the wire is called.
 * @returns The Wire function filter.
 */
export function filter<Payload>(
  wire: Wire<Payload>,
  filterFn: (parameters: WireParams<Payload>) => boolean
): Wire<Payload> {
  return (observable, store) =>
    wire(observable.pipe(filterRx(wirePayload => filterFn({ ...wirePayload, store }))), store);
}

/**
 * Creates a {@link Wire} that is only executed when the payload is truthy. A truthy value is
 * whatever is not a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy | falsy value}.
 *
 * @param wire - The wire to avoid executing when the payload is falsy.
 * @returns The Wire function falsy filter.
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
 * @returns The Wire function with a debounced timing.
 */
export function debounce<Payload>(
  wire: Wire<Payload>,
  timeInMs: TimeRetrieving | number
): Wire<Payload> {
  return (observable, store) =>
    wire(
      observable.pipe(
        debounceRx(() => interval(typeof timeInMs === 'function' ? timeInMs(store) : timeInMs))
      ),
      store
    );
}

/**
 * Creates a throttled {@link Wire}. Being throttled means that it will only be executed once
 * every couple of milliseconds given by the `timeInMs` parameter.
 *
 * @param wire - The wire to throttle.
 * @param timeInMs - The time in milliseconds to throttle the wire execution or a function to
 * retrieve it from the store.
 * @returns The Wire function with a throttle timing.
 */
export function throttle<Payload>(
  wire: Wire<Payload>,
  timeInMs: TimeRetrieving | number
): Wire<Payload> {
  return (observable, store) =>
    wire(
      observable.pipe(
        throttleRx(() => interval(typeof timeInMs === 'function' ? timeInMs(store) : timeInMs), {
          leading: true,
          trailing: true
        })
      ),
      store
    );
}
