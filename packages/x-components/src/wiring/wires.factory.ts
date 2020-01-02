import { AnyWire, Wire } from './wiring.types';

/**
 * Creates a wire that commits a mutation to the store. This wire can be used in every event, as it does not have a payload type
 * associated.
 * @param mutation The mutation to commit
 * @param staticPayload A static payload to pass to the mutation which will be committed
 * @returns [AnyWire] A wire that commits the mutation with the staticPayload payload
 */
export function commit(mutation: string, staticPayload: any): AnyWire;
/**
 * Creates a wire that commits a mutation to the store. This wire will commit to the store the payload that it receives in the observable
 * @param mutation The mutation to commit
 * @typeParam Payload the type of the payload that this wire will receive
 * @returns [Wire<Payload>] A wire that commits the mutation with the payload that it receives in the observable
 */
export function commit<Payload>(mutation: string): Wire<Payload>;
export function commit<Payload>(mutation: string, staticPayload?: any): Wire<Payload> {
  return function commitWire(observable, store) {
    return observable.subscribe(staticPayload !== undefined
      ? () => store.commit(mutation, staticPayload)
      : payload => store.commit(mutation, payload)
    );
  };
}

/**
 * Creates a wire that commits a mutation to the store, but without any payload. This wire can be used in every event, as it does not have
 * a payload type associated.
 * @param mutation The mutation to commit
 * @returns [AnyWire] A wire that commits the mutation without any payload
 */
export function commitWithoutPayload(mutation: string): AnyWire {
  return function commitWire(observable, store) {
    return observable.subscribe(() => store.commit(mutation));
  };
}

/**
 * Creates a wire that dispatches an action to the store. This wire can be used in every event, as it does not have a payload type
 * associated.
 * @param action The action name to dispatch
 * @param staticPayload A static payload to pass to the action which will be dispatched
 * @returns [AnyWire] A wire that dispatches the action with the staticPayload payload
 */
export function dispatch(action: string, staticPayload: any): AnyWire;
/**
 * Creates a wire that dispatches an action to the store. This wire will pass the payload received in the observable to the action
 * @param action The action to dispatch
 * @typeParam Payload the type of the payload that this wire will receive
 * @returns [Wire<Payload>] A wire that dispatches the action with the payload that it receives in the observable
 */
export function dispatch<Payload>(action: string): Wire<Payload>;
export function dispatch<Payload>(action: string, staticPayload?: Payload): Wire<Payload> {
  return function dispatchWire(observable, store) {
    return observable.subscribe(staticPayload !== undefined
      ? () => store.dispatch(action, staticPayload)
      : payload => store.dispatch(action, payload));
  };
}

/**
 * Creates a wire that dispatches an action to the store, but without any payload. This wire can be used in every event, as it does not
 * have a payload type associated.
 * @param action The action name to dispatch
 * @returns [AnyWire] A wire that dispatches the action without any payload
 */
export function dispatchWithoutPayload(action: string): AnyWire {
  return function dispatchWire(observable, store) {
    return observable.subscribe(() => store.dispatch(action));
  };
}
