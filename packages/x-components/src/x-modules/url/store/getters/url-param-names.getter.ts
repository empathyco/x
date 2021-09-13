import { UrlParamKey, UrlXStoreModule } from '../types';
import { reduce } from '../../../../utils/object';

/**
 * Default implementation for the {@link UrlGetters.urlMappedParamNames} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the url module.
 *
 * @returns The url params.
 *
 * @public
 */
export const urlMappedParamNames: UrlXStoreModule['getters']['urlMappedParamNames'] = ({
  config: { urlParamNames },
  extraParams,
  ...rawUrlParams
}) => {
  return reduce(
    { ...rawUrlParams, ...extraParams },
    (urlParams, key) => {
      urlParams[key] = urlParamNames[key] ?? key;
      return urlParams;
    },
    {} as Record<UrlParamKey, UrlParamKey>
  );
};
