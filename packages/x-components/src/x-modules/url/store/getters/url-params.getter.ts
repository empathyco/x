import { MappedParams, UrlParamValue, UrlXStoreModule } from '../types';
import { reduce } from '../../../../utils/object';

/**
 * Default implementation for the {@link UrlGetters.urlParams} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the url module.
 *
 * @returns The url params.
 *
 * @public
 */
export const urlParams: UrlXStoreModule['getters']['urlParams'] = ({
  config: { urlParamNames },
  extraParams,
  ...params
}) => {
  return reduce(
    { ...extraParams, ...params },
    (mappedParams, key, value) => {
      const mappedKey = urlParamNames[key] ?? key;
      mappedParams[key] = {
        key: mappedKey,
        value: value as UrlParamValue
      };
      return mappedParams;
    },
    {} as MappedParams
  );
};
