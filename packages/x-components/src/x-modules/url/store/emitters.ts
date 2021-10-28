import { createStoreEmitters } from '../../../store';
import { UrlParams } from '../../../types/url-params';
import { urlXStoreModule } from './module';
import { UrlParamKey } from './types';

/**
 * The params from {@link UrlParams} that provokes a replace instead of a push in the browser URL
 * state.
 *
 * @internal
 */
export const replaceableParams: UrlParamKey[] = ['scroll', 'page'];

/**
 * Compares new and old {@link UrlParams} to know if not replaceable params have changed.
 *
 * @param newParams - The new {@link UrlParams} to compare.
 * @param oldParams - The old {@link UrlParams} to compare.
 *
 * @returns True if is pushable change, false otherwise.
 */
function shouldPushUrl(newParams: UrlParams, oldParams: UrlParams): boolean {
  return Object.keys(newParams).some(
    key => !replaceableParams.includes(key) && oldParams[key] !== newParams[key]
  );
}

/**
 * Compares new and old {@link UrlParams} to know if replaceable params have changed.
 *
 * @param newParams - The new {@link UrlParams} to compare.
 * @param oldParams - The old {@link UrlParams} to compare.
 *
 * @returns True if is pushable change, false otherwise.
 */
function shouldReplaceUrl(newParams: UrlParams, oldParams: UrlParams): boolean {
  return (
    Object.keys(newParams).some(
      key => replaceableParams.includes(key) && oldParams[key] !== newParams[key]
    ) && !shouldPushUrl(newParams, oldParams)
  );
}

/**
 * {@link StoreEmitters} For the URL module.
 *
 * @internal
 */
export const urlEmitters = createStoreEmitters(urlXStoreModule, {
  PushableUrlStateChanged: {
    selector: (_, getters) => getters.urlParams,
    filter: shouldPushUrl
  },
  ReplaceableUrlStateChanged: {
    selector: (_, getters) => getters.urlParams,
    filter: shouldReplaceUrl
  }
});
