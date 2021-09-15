import { Dictionary } from '../../../../utils/types';
import { UrlParamValue, UrlXStoreModule } from '../types';
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
export const urlParams: UrlXStoreModule['getters']['urlParams'] = ({
  config,
  extraParams,
  ...rawUrlParams
}) => objectFilter({ ...rawUrlParams, ...extraParams }, isValidParam);

const invalidUrlValues: Dictionary<UrlParamValue> = {
  page: 1
};

/**
 * Checks if a value is valid to add it to the URL.
 *
 * @param key - The key parameter.
 * @param value - The value of the key parameter.
 *
 * @returns A boolean indicating if the parameter is valid or not.
 */
function isValidParam(key: string, value: UrlParamValue): boolean {
  return Array.isArray(value)
    ? value.length > 0
    : value != null && value !== '' && value !== invalidUrlValues[key];
}
