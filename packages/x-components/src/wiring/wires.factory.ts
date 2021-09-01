import { Store } from 'vuex';
import { RootXStoreState, WiringData } from '../store/store.types';
import { XModuleName } from '../x-modules/x-modules.types';
import {
  AnyWire,
  Wire,
  WireParams,
  WirePayload,
  WireService,
  WireServiceWithoutPayload
} from './wiring.types';

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
 * Creates a wire that commits a mutation to the store. This wire receives a function. This function
 * is used to get the actual payload value passed to mutation.
 * This wire can be used in every event, as it does not have a payload type associated.
 *
 * @param mutation - The full mutation path to commit. I.e. `x/searchBox/setQuery`.
 * @param payloadFactory - A function that receives the an {@link RootStoreStateAndGetters | object}
 * with the Store state and getters as parameter.
 * @returns A {@link AnyWire} wire that commits the mutation with the payload returned by the
 * payloadFactory.
 * @public
 */
export function wireCommit<Payload>(
  mutation: string,
  payloadFactory: (params: WiringData<Payload>) => any
): AnyWire;
/**
 * Creates a wire that commits a mutation to the store. This wire can receive any value as payload.
 * This wire can be used in every event, as it does not have a payload type associated.
 *
 * @param mutation - The full mutation path to commit. I.e. `x/searchBox/setQuery`.
 * @param staticPayload - A static payload to pass to the mutation.
 * @returns {@link AnyWire} A wire that commits the mutation with the staticPayload payload.
 * @public
 */
export function wireCommit(mutation: string, staticPayload: any): AnyWire;
/**
 * Creates a wire that commits a mutation to the store. This wire will commit to the store the
 * payload that it receives in the observable.
 *
 * @param mutation - The full mutation path to commit. I.e. `x/searchBox/setQuery`.
 * @typeParam Payload - The type of the payload that this wire will receive
 * @returns {@link Wire} A wire that commits the mutation with the payload that it receives
 * in the observable.
 * @public
 */
export function wireCommit<Payload>(mutation: string): Wire<Payload>;
// eslint-disable-next-line jsdoc/require-jsdoc
export function wireCommit<Payload>(mutation: string, payload?: Payload): Wire<Payload> {
  return (observable, store) =>
    observable.subscribe(createSubscriptionCallback(store, 'commit', mutation, payload));
}

/**
 * Creates a wire that commits a mutation to the store, but without any payload. This wire can
 * be used in every event, as it does not have a payload type associated.
 *
 * @param mutation - The full mutation path to commit. I.e. `x/searchBox/setQuery`.
 * @returns {@link AnyWire} A wire that commits the mutation without any payload.
 * @public
 */
export function wireCommitWithoutPayload(mutation: string): AnyWire {
  return (observable, store) => observable.subscribe(() => store.commit(mutation));
}

/**
 * Creates a wire that dispatch an action to the store. This wire receives a function. This function
 * is used to get the actual payload value passed to action.
 * This wire can be used in every event, as it does not have a payload type associated.
 *
 * @param action - The full action path to dispatch. I.e. `x/querySuggestions/fetchSuggestions`.
 * @param payloadFactory - A function that receives the an {@link RootStoreStateAndGetters | object}
 * with the Store state and getters as parameter.
 * @returns A {@link AnyWire} wire that dispatches the action with the payload returned by the
 * payloadFactory.
 * @public
 */
export function wireDispatch<Payload>(
  action: string,
  payloadFactory: (params: WiringData<Payload>) => any
): AnyWire;
/**
 * Creates a wire that dispatches an action to the store. This wire can be used in every event,
 * as it does not have a payload type associated.
 *
 * @param action - The full action path to dispatch. I.e. `x/querySuggestions/fetchSuggestions`.
 * @param staticPayload - A static payload to pass to the action which will be dispatched.
 * @returns {@link AnyWire} A wire that dispatches the action with the staticPayload payload.
 * @public
 */
export function wireDispatch(action: string, staticPayload: any): AnyWire;
/**
 * Creates a wire that dispatches an action to the store. This wire will pass the payload
 * received in the observable to the action.
 *
 * @param action - The full action path to dispatch. I.e. `x/querySuggestions/fetchSuggestions`.
 * @typeParam Payload - The type of the payload that this wire will receive
 * @returns {@link Wire} A wire that dispatches the action with the payload that it receives
 * in the observable.
 * @public
 */
export function wireDispatch<Payload>(action: string): Wire<Payload>;
// eslint-disable-next-line jsdoc/require-jsdoc
export function wireDispatch<Payload>(action: string, payload?: Payload): Wire<Payload> {
  return (observable, store) =>
    observable.subscribe(createSubscriptionCallback(store, 'dispatch', action, payload));
}

/**
 * Creates a wire that dispatches an action to the store, but without any payload. This wire can
 * be used in every event, as it does not have a payload type associated.
 *
 * @param action - The full action path to dispatch. I.e. `x/querySuggestions/fetchSuggestions`.
 * @returns {@link AnyWire} A wire that dispatches the action without any payload.
 * @public
 */
export function wireDispatchWithoutPayload(action: string): AnyWire {
  return (observable, store) => observable.subscribe(() => store.dispatch(action));
}

/**
 * Creates a wires factory that can create wires that will invoke the service methods.
 *
 * @param service - The service to invoke its methods.
 * @returns A factory to create wires that invoke the service methods.
 * @public
 */
export function wireService<SomeService>(service: SomeService): WireService<SomeService> {
  return (method, payload?) => {
    return observable =>
      observable.subscribe(
        payload !== undefined
          ? () => service[method](payload)
          : observablePayload => service[method](observablePayload.eventPayload)
      );
  };
}

/**
 * Creates a wires factory that can create wires that will invoke the service methods but
 * without payload.
 *
 * @param service - The service to invoke its methods.
 * @returns A factory to create wires that invoke the service methods without payload.
 * @public
 */
export function wireServiceWithoutPayload<SomeService>(
  service: SomeService
): WireServiceWithoutPayload<SomeService> {
  return method => {
    return observable => observable.subscribe(() => service[method]());
  };
}

/**
 * Creates the callback function for the {@link wireCommit} and {@link wireDispatch}
 * subscriptions. It can be based on the payload as function which retrieves the observable
 * payload from the store, a static payload or the event value from the observable.
 *
 * @param store - The {@link RootXStoreState} store.
 * @param commitOrDispatch - The executor over store. It can be `commit` or `dispatch`.
 * @param mutationOrAction - The mutation or action to commit or dispatch respectively.
 * @param payload - The payload for the store executor. It can be a function which retrieves the
 * payload from the store, a static payload or the event value from the observable.
 * @typeParam Payload - The type of the payload to get the observable event value type.
 * @returns A function to commit or dispatch a payload value over store.
 * @internal
 */
function createSubscriptionCallback<Payload>(
  store: Store<RootXStoreState>,
  commitOrDispatch: 'commit' | 'dispatch',
  mutationOrAction: string,
  payload?: Payload
): (observableValue: WirePayload<Payload>) => void {
  const storeExecutor = store[commitOrDispatch];
  return typeof payload === 'function'
    ? ({ eventPayload, metadata }) => {
        return storeExecutor(
          mutationOrAction,
          payload({
            state: store.state,
            getters: store.getters,
            payload: eventPayload,
            metadata
          })
        );
      }
    : payload !== undefined
    ? () => {
        storeExecutor(mutationOrAction, payload);
      }
    : observableValue => {
        storeExecutor(mutationOrAction, observableValue.eventPayload);
      };
}
