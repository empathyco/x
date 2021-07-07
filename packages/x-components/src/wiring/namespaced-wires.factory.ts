import { RootStoreStateAndGetters } from '../store/store.types';
import { XModuleName } from '../x-modules/x-modules.types';
import {
  NamespacedWireCommit,
  NamespacedWireCommitWithoutPayload,
  NamespacedWireDispatch,
  NamespacedWireDispatchWithoutPayload
} from './namespaced-wiring.types';
import {
  wireCommit,
  wireCommitWithoutPayload,
  wireDispatch,
  wireDispatchWithoutPayload
} from './wires.factory';
import { getStateAndGettersFromModule } from './wiring.utils';

/**
 * Creates a namespaced {@link (wireCommit:1)} for the module name passed.
 *
 * @param moduleName - The module name for scoping the {@link (wireCommit:1)}.
 * @returns A function which creates a namespaced wire for the {@link (wireCommit:1)}.
 *
 * @public
 */
export function namespacedWireCommit<ModuleName extends XModuleName>(
  moduleName: ModuleName
): NamespacedWireCommit<ModuleName> {
  return (mutation: string, payload?: unknown) =>
    wireCommit(`x/${moduleName}/${mutation}`, getPayload(moduleName, payload));
}

/**
 * Creates a namespaced {@link wireCommitWithoutPayload} for the module name passed.
 *
 * @param moduleName - The module name for scoping the {@link wireCommitWithoutPayload}.
 * @returns A function which creates a namespaced wire for the {@link wireCommitWithoutPayload}.
 *
 * @public
 */
export function namespacedWireCommitWithoutPayload<ModuleName extends XModuleName>(
  moduleName: ModuleName
): NamespacedWireCommitWithoutPayload<ModuleName> {
  return mutation => wireCommitWithoutPayload(`x/${moduleName}/${mutation as string}`);
}

/**
 * Creates a namespaced {@link (wireDispatch:1)} for the module name passed.
 *
 * @param moduleName - The module name for scoping the {@link (wireDispatch:1)}.
 * @returns A function which creates a namespaced wire for the {@link (wireDispatch:1)}.
 *
 * @public
 */
export function namespacedWireDispatch<ModuleName extends XModuleName>(
  moduleName: ModuleName
): NamespacedWireDispatch<ModuleName> {
  return (action: string, payload?: unknown) =>
    wireDispatch(`x/${moduleName}/${action}`, getPayload(moduleName, payload));
}

/**
 * Creates a namespaced {@link wireDispatchWithoutPayload} for the module name passed.
 *
 * @param moduleName - The module name for scoping the {@link wireDispatchWithoutPayload}.
 * @returns A function which creates a namespaced wire for the {@link wireDispatchWithoutPayload}.
 *
 * @public
 */
export function namespacedWireDispatchWithoutPayload<ModuleName extends XModuleName>(
  moduleName: ModuleName
): NamespacedWireDispatchWithoutPayload<ModuleName> {
  return action => wireDispatchWithoutPayload(`x/${moduleName}/${action as string}`);
}

/**
 * Decision maker of if the payload is a function which receives the
 * {@link StoreModuleStateAndGetters | module state and getters} and returns the payload for
 * or a static value.
 *
 * @param moduleName - The {@link XModuleName | module name} for scoping the state and getters.
 * @param payload - The payload for the wire which can be a retrieving function or a static value.
 * @returns The function which will retrieve data from the store or the static value.
 *
 * @internal
 */
function getPayload(moduleName: XModuleName, payload: unknown): unknown {
  return typeof payload === 'function'
    ? ({ state, getters }: RootStoreStateAndGetters) =>
        payload(getStateAndGettersFromModule(state, getters, moduleName))
    : payload;
}
