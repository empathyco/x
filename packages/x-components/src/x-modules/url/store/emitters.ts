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
 * Compares new and old {@link UrlParams} to know if we have to do a push or a replace in the
 * browser URL history. It uses the `replaceableParams` const to know what params causes a replace
 * instead of a push..
 *
 * @param newParams - The new {@link UrlParams} to compare.
 * @param oldParams - The old {@link UrlParams} to compare.
 *
 * @returns True if is pushable change, false otherwise.
 */
export function isPushableParams(newParams: UrlParams, oldParams: UrlParams): boolean {
  return !replaceableParams.some(key => oldParams[key] && oldParams[key] !== newParams[key]);
}

/**
 * {@link StoreEmitters} For the URL module.
 *
 * @internal
 */
export const urlEmitters = createStoreEmitters(urlXStoreModule, {
  PushableUrlStateChanged: {
    selector: (_, getters) => getters.urlParams,
    filter: isPushableParams
  },
  ReplaceableUrlStateChanged: {
    selector: (_, getters) => getters.urlParams,
    filter: (newValues, oldValues) => !isPushableParams(newValues, oldValues)
  }
});
