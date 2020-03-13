import { Wire, WireParams } from './wiring.types';
import { filter as filterRx } from 'rxjs/operators/filter';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { throttleTime } from 'rxjs/operators/throttleTime';

/**
 * Creates a {@link Wire} that is only executed whenever the condition in the filterFn is true.
 *
 * @param wire - The wire to filter
 * @param filterFn - A function which must return a boolean and that will be executed every time the wire is called
 */
export function filter<Payload>(
  wire: Wire<Payload>,
  filterFn: (parameters: WireParams<Payload>) => boolean
): Wire<Payload> {
  return (observable, store) =>
    wire(observable.pipe(filterRx(wirePayload => filterFn({ ...wirePayload, store }))), store);
}

/**
 * Creates a {@link Wire} that is only executed when the payload is truthy. A truthy value is whatever is not a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy falsy value}
 *
 * @param wire - The wire to avoid executing when the payload is falsy
 */
export function filterFalsyPayload<Payload>(wire: Wire<Payload>): Wire<Payload> {
  return filter(wire, ({ eventPayload }) => !!eventPayload);
}

/**
 * Creates a {@link Wire} that is only executed when the payload is a {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy falsy value}
 *
 * @param wire - The wire to avoid executing when the payload is truthy
 */
export function filterTruthyPayload<Payload>(wire: Wire<Payload>): Wire<Payload> {
  return filter(wire, ({ eventPayload }) => !eventPayload);
}

/**
 * Creates a debounced {@link Wire}. Being debounced means that it will only be executed after the time given by `timeInMs` has passed without invoking it
 *
 * @param wire - The wire to debounce
 * @param timeInMs - The time in milliseconds to debounce the wire execution
 */
export function debounce<Payload>(wire: Wire<Payload>, timeInMs: number): Wire<Payload> {
  return (observable, store) => wire(observable.pipe(debounceTime(timeInMs)), store);
}

/**
 * Creates a throttled {@link Wire}. Being throttled means that it will only be executed once every couple of seconds given by the `timeInMs` parameter.
 *
 * @param wire - The wire to throttle
 * @param timeInMs - The time in milliseconds to throttle the wire execution
 */
export function throttle<Payload>(wire: Wire<Payload>, timeInMs: number): Wire<Payload> {
  return (observable, store) =>
    wire(
      observable.pipe(throttleTime(timeInMs, undefined, { leading: true, trailing: true })),
      store
    );
}
