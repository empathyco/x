import { XModuleName, XModulesTree } from '../x-modules/x-modules.types';
import { AnyWire, NamespacedWireFactory, Wire, WireParams } from './wiring.types';

/**
 * Creates a wire that executes the function passed. This function will receive a
 * {@link WireParams} object.
 *
 * @param fn - The function to execute whenever a new value is emitted to the observable.
 * @returns The Wire function.
 * @public
 */
export function createWireFromFunction<Payload>(
  fn: (parameters: WireParams<Payload>) => void
): Wire<Payload> {
  return (observable, store) =>
    observable.subscribe(({ metadata, eventPayload }) => {
      fn({ eventPayload, store, metadata });
    });
}

/**
 * Creates a wire that commits a mutation to the store. This wire can be used in every event, as
 * it does not have a payload type associated.
 *
 * @param mutation - The full mutation path to commit. I.e. `x/search/setQuery`.
 * @param staticPayload - A static payload to pass to the mutation which will be committed.
 * @returns [AnyWire] A wire that commits the mutation with the staticPayload payload.
 * @public
 */
export function wireCommit(mutation: string, staticPayload: any): AnyWire;
/**
 * Creates a wire that commits a mutation to the store. This wire will commit to the store the
 * payload that it receives in the observable.
 *
 * @param mutation - The full mutation path to commit. I.e. `x/search/setQuery`.
 * @typeParam Payload - The type of the payload that this wire will receive
 * @returns [Wire<Payload>] A wire that commits the mutation with the payload that it receives
 * in the observable.
 * @public
 */
export function wireCommit<Payload>(mutation: string): Wire<Payload>;
// eslint-disable-next-line jsdoc/require-jsdoc
export function wireCommit<Payload>(mutation: string, staticPayload?: any): Wire<Payload> {
  return (observable, store) =>
    observable.subscribe(
      staticPayload !== undefined
        ? () => store.commit(mutation, staticPayload)
        : value => store.commit(mutation, value.eventPayload)
    );
}

/**
 * Creates a wire that commits a mutation to the store, but without any payload. This wire can
 * be used in every event, as it does not have a payload type associated.
 *
 * @param mutation - The full mutation path to commit. I.e. `x/search/setQuery`.
 * @returns [AnyWire] A wire that commits the mutation without any payload.
 * @public
 */
export function wireCommitWithoutPayload(mutation: string): AnyWire {
  return (observable, store) => observable.subscribe(() => store.commit(mutation));
}

/**
 * Creates a wire that dispatches an action to the store. This wire can be used in every event,
 * as it does not have a payload type associated.
 *
 * @param action - The full action path to commit. I.e. `x/query-suggestions/getSuggestions`.
 * @param staticPayload - A static payload to pass to the action which will be dispatched.
 * @returns [AnyWire] A wire that dispatches the action with the staticPayload payload.
 * @public
 */
export function wireDispatch(action: string, staticPayload: any): AnyWire;
/**
 * Creates a wire that dispatches an action to the store. This wire will pass the payload
 * received in the observable to the action.
 *
 * @param action - The full action path to commit. I.e. `x/query-suggestions/getSuggestions`.
 * @typeParam Payload - the type of the payload that this wire will receive
 * @returns [Wire<Payload>] A wire that dispatches the action with the payload that it receives
 * in the observable.
 * @public
 */
export function wireDispatch<Payload>(action: string): Wire<Payload>;
// eslint-disable-next-line jsdoc/require-jsdoc
export function wireDispatch<Payload>(action: string, staticPayload?: any): Wire<Payload> {
  return (observable, store) =>
    observable.subscribe(
      staticPayload !== undefined
        ? () => store.dispatch(action, staticPayload)
        : value => store.dispatch(action, value.eventPayload)
    );
}

/**
 * Creates a wire that dispatches an action to the store, but without any payload. This wire can
 * be used in every event, as it does not have a payload type associated.
 *
 * @param action - The full action path to commit. I.e. `x/query-suggestions/getSuggestions`.
 * @returns [AnyWire] A wire that dispatches the action without any payload.
 * @public
 */
export function wireDispatchWithoutPayload(action: string): AnyWire {
  return (observable, store) => observable.subscribe(() => store.dispatch(action));
}

/**
 * Creates namespaced wire factory functions for the module name passed.
 *
 * @param moduleName - The module name for scoping the wire factory functions.
 * @returns The WireFactory namespaced with the XModule.
 * @public
 */
export function withModule<Module extends XModuleName>(
  moduleName: Module
): NamespacedWireFactory<XModulesTree[Module]> {
  const modulePath = `x/${moduleName}`;
  return {
    wireCommit(mutation: string, payload?: any) {
      return wireCommit(`${modulePath}/${mutation}`, payload);
    },
    wireCommitWithoutPayload(mutation) {
      return wireCommitWithoutPayload(`${modulePath}/${mutation}`);
    },
    wireDispatch(action: string, payload?: any) {
      return wireDispatch(`${modulePath}/${action}`, payload);
    },
    wireDispatchWithoutPayload(action) {
      return wireDispatchWithoutPayload(`${modulePath}/${action}`);
    }
  };
}
