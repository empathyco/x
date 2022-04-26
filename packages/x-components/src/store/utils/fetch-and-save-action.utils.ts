import { cancellablePromise, CancelSymbol } from '../../utils/cancellable-promise';
import { XActionContext } from '../actions.types';
import { StatusMutations, StatusState } from './status-store.utils';

/**
 * Utility to create an action that requests and save some data asynchronously, with the
 * option to cancel the request at any moment. This factory provides with the standard flow
 * for requesting, cancelling, handling errors for a module, while also taking care of its status.
 *
 * @public
 * @returns An action to fetch and save some data, and an action to cancel the last request.
 */
export function createFetchAndSaveActions<
  // Using `object` type to ensure no actions/getters can be used.
  // eslint-disable-next-line @typescript-eslint/ban-types
  Context extends XActionContext<StatusState, object, StatusMutations, object>,
  Request,
  Response
>({
  fetch,
  onSuccess,
  // eslint-disable-next-line no-console
  onError = console.error,
  onCancel
}: FetchAndSaveHooks<Context, Request, Response>): FetchAndSaveActions<Context, Request> {
  let cancelPreviousRequest: undefined | (() => void);

  /**
   * Called asynchronously after a response has been received.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions, provided by Vuex.
   * @param response - The fetch response.
   * @returns A Promise that resolves after handling the response.
   */
  function handleResponse(context: Context, response: Response): Promise<void> {
    return Promise.resolve(onSuccess(context, response)).then(() => {
      context.commit('setStatus', 'success');
    });
  }

  /**
   * Called immediately after a request has been cancelled.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions, provided by Vuex.
   */
  function handleCancel(context: Context): void {
    cancelPreviousRequest = undefined;
    context.commit('setStatus', 'success');
    onCancel?.();
  }

  /**
   * Called asynchronously whenever an error happens in the fetch and save flow.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions, provided by Vuex.
   * @param error - The error information.
   */
  function handleError(context: Context, error: unknown): void {
    if (error !== CancelSymbol) {
      context.commit('setStatus', 'error');
      onError(error);
    }
  }

  // eslint-disable-next-line
  /** @see FetchAndSaveActions.fetchAndSave */
  function fetchAndSave(context: Context, request: Request): Promise<void> {
    cancelPrevious();
    context.commit('setStatus', 'loading');
    const { promise, cancel } = cancellablePromise(fetch(context, request), () => {
      handleCancel(context);
    });

    cancelPreviousRequest = cancel;
    return promise
      .then(response => handleResponse(context, response))
      .catch(error => handleError(context, error));
  }

  // eslint-disable-next-line
  /** @see FetchAndSaveActions.cancelPrevious */
  function cancelPrevious(): void {
    cancelPreviousRequest?.();
  }

  return {
    fetchAndSave,
    cancelPrevious
  };
}

/**
 * Options to use with the {@link createFetchAndSaveActions} factory.
 *
 * @public
 */
export interface FetchAndSaveHooks<
  // Using `object` type to ensure no actions/getters can be used.
  // eslint-disable-next-line @typescript-eslint/ban-types
  Context extends XActionContext<StatusState, object, StatusMutations, object>,
  Request,
  Response
> {
  /**
   * Retrieves and returns asynchronously some data.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions, provided by Vuex.
   * @param request - The request object used for fetching.
   * @returns A Promise resolved with the response of the fetch request.
   */
  fetch(context: Context, request: Request): Promise<Response>;
  /**
   * Asynchronous callback executed when the {@link FetchAndSaveHooks.fetch} is
   * performed successfully.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions, provided by Vuex.
   * @param response - The data returned by {@link FetchAndSaveHooks.fetch}.
   */
  onSuccess(context: Context, response: Response): void;
  /**
   * Asynchronous callback executed when either the {@link FetchAndSaveHooks.fetch}
   * or {@link FetchAndSaveHooks.onSuccess} methods fail.
   *
   * @param error - The error that triggered this callback.
   */
  onError?(error: unknown): void;
  /**
   * Synchronous callback executed when the request is cancelled. This can happen mainly for two
   * reasons:
   * - The {@link FetchAndSaveActions.cancelPrevious} action is dispatched.
   * - A new {@link FetchAndSaveActions.fetchAndSave} is dispatched before the previous one was
   * resolved.
   */
  onCancel?(): void;
}

/**
 * Actions returned from the {@link createFetchAndSaveActions}.
 *
 * @public
 */
export interface FetchAndSaveActions<
  // Using `object` type to ensure no actions/getters can be used.
  // eslint-disable-next-line @typescript-eslint/ban-types
  Context extends XActionContext<StatusState, object, StatusMutations, object>,
  Request
> {
  /**
   * Action that requests and saves the response.
   *
   * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the
   * actions, provided by Vuex.
   * @returns A promise that resolves after saving the response.
   */
  fetchAndSave: (context: Context, request: Request) => void | Promise<void>;
  /**
   * Action that cancels the previous request call if it stills in progress.
   */
  cancelPrevious: () => void;
}
