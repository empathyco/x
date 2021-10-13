import { createStoreEmitters } from '../../../store';
import { urlXStoreModule } from './module';
import { UrlParamKey, UrlParams } from './types';

/**
 * The params from {@link UrlParams} that provokes a replace instead of a push in the browser URL
 * state.
 *
 * @internal
 */
export const pushableParams: UrlParamKey[] = ['scroll', 'page'];

/**
 * {@link StoreEmitters} For the URL module.
 *
 * @internal
 */
export const urlEmitters = createStoreEmitters(urlXStoreModule, {
  PushableUrlStateChanged: {
    selector: (_, getters) => getters.urlParams,
    filter: (newValues: UrlParams, oldValues: UrlParams) =>
      !pushableParams.some(key => oldValues[key] && oldValues[key] !== newValues[key])
  },
  ReplaceableUrlStateChanged: {
    selector: (_, getters) => getters.urlParams,
    filter: (newValues: UrlParams, oldValues: UrlParams) =>
      pushableParams.some(key => oldValues[key] && oldValues[key] !== newValues[key])
  }
});
