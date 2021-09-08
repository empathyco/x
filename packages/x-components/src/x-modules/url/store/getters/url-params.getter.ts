import { UrlGetters, UrlParamValue, UrlXStoreModule } from '../types';
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
  config,
  extraParams,
  ...rawUrlParams
}) => {
  return reduce(
    { ...rawUrlParams, ...extraParams },
    (urlParams, key, value) => {
      if (isValidParam(value as string | Array<string>) && !isFirstPage(key, value as number)) {
        urlParams[key] = value as UrlParamValue;
        return urlParams;
      }
      return urlParams;
    },
    <UrlGetters['urlParams']>{}
  );
};

/**
 *
 * Checks if the page parameter is less than one.
 *
 * @param key - The param key.
 * @param value - The value of the param.
 *
 * @returns Boolean.
 *
 * @internal
 */
function isFirstPage(key: string, value: number): boolean {
  return key === 'page' && value <= 1;
}

/**
 *
 * Validates if a param is not an empty array or string.
 *
 * @param value - The value to be validated.
 *
 * @returns Boolean.
 *
 * @internal
 */
function isValidParam(value: string | Array<string>): boolean {
  return !!value && value.length !== 0;
}
