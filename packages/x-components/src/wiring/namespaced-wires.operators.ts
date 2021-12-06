import { XModuleName } from '../x-modules/x-modules.types';
import { NamespacedTimeWireOperator } from './namespaced-wiring.types';
import { debounce, throttle } from './wires.operators';
import { AnyWire } from './wiring.types';
import { getStateAndGettersFromModule } from './wiring.utils';

/**
 * Type safe debounce operator which creates a function which can only access the Module of
 * the {@link https://vuex.vuejs.org/ | Vuex} Store passed as parameter.
 *
 * @param moduleName - The {@link XModuleName} to create the operator wire.
 * @returns A function which creates a wire that uses the {@link debounce} wire operator to
 * execute the `wire` after the time has passed without invoking it. This debounce time
 * is given by the execution of the `timeRetrieving` function.
 *
 * @public
 */
export function namespacedDebounce<ModuleName extends XModuleName>(
  moduleName: ModuleName
): NamespacedTimeWireOperator<ModuleName, AnyWire> {
  return createNamespacedTimeWireOperator(moduleName, debounce);
}

/**
 * Type safe throttle operator which creates a function which can only access the Module of
 * the {@link https://vuex.vuejs.org/ | Vuex} Store passed as parameter.
 *
 * @param moduleName - The {@link XModuleName} to create the operator wire.
 * @returns A function which creates a wire that uses the {@link throttle} wire operator to
 * execute the `wire` once every couple of milliseconds. This throttle time is given by
 * the execution of the `timeRetrieving` function.
 *
 * @public
 */
export function namespacedThrottle<ModuleName extends XModuleName>(
  moduleName: ModuleName
): NamespacedTimeWireOperator<ModuleName, AnyWire> {
  return createNamespacedTimeWireOperator(moduleName, throttle);
}

/**
 * Creates a function which creates a namespaced wire that uses the {@link debounce} or
 * {@link throttle} time wire operator.
 *
 * @param moduleName - The {@link XModuleName} to create the operator wire.
 * @param timingOperator - The time wire operator {@link debounce} or {@link throttle}.
 * @returns A function which creates a namespaced time wire operator.
 *
 * @internal
 */
function createNamespacedTimeWireOperator<ModuleName extends XModuleName>(
  moduleName: ModuleName,
  timingOperator: typeof throttle | typeof debounce
): NamespacedTimeWireOperator<ModuleName, AnyWire> {
  return (wire, timeSelector, options) =>
    timingOperator(
      wire,
      ({ state, getters }) =>
        timeSelector(getStateAndGettersFromModule(state, getters, moduleName)),
      options
    );
}
