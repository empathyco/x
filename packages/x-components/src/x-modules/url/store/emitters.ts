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
function shouldPushUrl(
  newParams: Partial<UrlParams> = {},
  oldParams: Partial<UrlParams> = {}
): boolean {
  const keys = Object.keys({ ...oldParams, ...newParams });
  return keys.some(key => !replaceableParams.includes(key) && oldParams[key] !== newParams[key]);
}

/**
 * Compares new and old {@link UrlParams} to know if replaceable params have changed.
 *
 * @param newParams - The new {@link UrlParams} to compare.
 * @param oldParams - The old {@link UrlParams} to compare.
 *
 * @returns True if is pushable change, false otherwise.
 */
function shouldReplaceUrl(
  newParams: Partial<UrlParams> = {},
  oldParams: Partial<UrlParams> = {}
): boolean {
  const keys = Object.keys({ ...oldParams, ...newParams });
  return (
    keys.some(key => replaceableParams.includes(key) && oldParams[key] !== newParams[key]) &&
    !shouldPushUrl(newParams, oldParams)
  );
}

/**
 * {@link StoreEmitters} For the URL module.
 *
 * @internal
 */
export const urlEmitters = createStoreEmitters(urlXStoreModule, {
  PushableUrlStateUpdated: {
    selector: (_, getters) => getters.urlParams,
    filter: shouldPushUrl,
    metadata: { replaceable: false }
  },
  ReplaceableUrlStateUpdated: {
    selector: (_, getters) => getters.urlParams,
    filter: shouldReplaceUrl,
    metadata: { replaceable: false }
  }
});
