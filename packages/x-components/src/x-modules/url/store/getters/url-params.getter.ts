import { UrlParams, UrlParamValue, UrlXStoreModule } from '../types';
import { objectFilter } from '../../../../utils/object';

/**
 * Default implementation for the {@link UrlGetters.urlParams} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the url module.
 *
 * @returns The url params.
 *
 * @public
 */
export const urlParams: UrlXStoreModule['getters']['urlParams'] = ({ extraParams, params }) =>
  objectFilter({ ...params, ...extraParams }, isValidUrlParam);

/**
 * Checks if a value is valid to add it to the URL.
 *
 * @param key - The key parameter.
 * @param value - The value of the key parameter.
 *
 * @returns A boolean indicating if the parameter is valid or not.
 */
function isValidUrlParam(key: string | number, value: UrlParamValue | unknown): boolean {
  const invalidUrlValues: Partial<UrlParams> = {
    page: 1,
    scroll: 0
  };
  return Array.isArray(value)
    ? value.length > 0
    : value != null && value !== '' && value !== invalidUrlValues[key];
}
