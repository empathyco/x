import { reduce } from '../../../../utils/object';
import { UrlGetters, UrlParamValue, UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlGetters.urlParams} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the url module.
 * @returns The url params.
 *
 * @public
 */
export const urlParams: UrlXStoreModule['getters']['urlParams'] = ({
  config,
  extraParams,
  ...rawUrlParams
}) => {
  return reduce(
    { ...rawUrlParams, ...extraParams },
    (urlParams, key, value) => {
      const newKey = config[key] ?? key;
      urlParams[newKey] = value as UrlParamValue;
      return urlParams;
    },
    <UrlGetters['urlParams']>{}
  );
};
