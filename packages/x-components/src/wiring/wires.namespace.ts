import { Store } from 'vuex';
import { RootXStoreState } from '../store/store.types';
import { getGettersProxy } from '../store/utils/get-getters-proxy';
import { ExtractState, XModuleName } from '../x-modules/x-modules.types';
import {
  wireCommit,
  wireCommitWithoutPayload,
  wireDispatch,
  wireDispatchWithoutPayload
} from './wires.factory';
import { debounce, throttle } from './wires.operators';
import { AnyWire, NamespacedWireFactory, WirePayloadParams } from './wiring.types';

/**
 * Creates namespaced wire factory functions for the module name passed.
 *
 * @param moduleName - The module name for scoping the wire factory functions.
 * @returns The {@link NamespacedWireFactory | WireFactory } namespaced with the XModule.
 *
 * @public
 */
export function withModule<ModuleName extends XModuleName>(
  moduleName: ModuleName
): NamespacedWireFactory<ModuleName> {
  const modulePath = `x/${moduleName}/`;
  return {
    wireCommit(mutation: string, payload?: any): AnyWire {
      const mutationFullPath = `${modulePath}${mutation}`;
      return typeof payload === 'function'
        ? wireCommit(mutationFullPath, ({ state, getters }) =>
            payload(getStateAndGettersFromModule(state, getters, moduleName))
          )
        : wireCommit(mutationFullPath, payload);
    },
    wireCommitWithoutPayload(mutation) {
      return wireCommitWithoutPayload(`${modulePath}${mutation}`);
    },
    wireDispatch(action: string, payload?: any) {
      return wireDispatch(`${modulePath}${action}`, payload);
    },
    wireDispatchWithoutPayload(action) {
      return wireDispatchWithoutPayload(`${modulePath}${action}`);
    },
    wireDebounce(wire, timeRetrieving): AnyWire {
      return debounce(wire, ({ state, getters }) =>
        timeRetrieving(getStateAndGettersFromModule(state, getters, moduleName))
      );
    },
    wireThrottle(wire, timeRetrieving): AnyWire {
      return throttle(wire, ({ state, getters }) =>
        timeRetrieving(getStateAndGettersFromModule(state, getters, moduleName))
      );
    }
  };
}

/**
 * Returns an object with the getters and state of a module of store defined by the moduleName
 * parameter.
 *
 * @param state - The Vuex store State.
 * @param getters - The Vuex store Getters.
 * @param moduleName - The {@link XModuleName} of the module.
 * @returns The {@link WirePayloadParams} with the Getters and the State of the
 * {@link XStoreModule | Store Module} defined by moduleName.
 * @internal
 */
function getStateAndGettersFromModule<ModuleName extends XModuleName>(
  state: RootXStoreState,
  getters: Pick<Store<any>, 'getters'>,
  moduleName: ModuleName
): WirePayloadParams<ModuleName> {
  return {
    state: state.x[moduleName] as ExtractState<ModuleName>,
    getters: getGettersProxy(getters, moduleName)
  };
}
