import { objectFilter } from '../../../../utils/object';
import { initialUrlState } from '../module';
import { UrlParamValue, UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlGetters.urlParams} getter.
 *
 * @param state - Current {@link https://vuex.vuejs.org/guide/state.html | state} of the url module.
 *
 * @returns The url params.
 *
 * @public
 */
export const urlParams: UrlXStoreModule['getters']['urlParams'] = ({ extraParams, params }) => ({
  ...objectFilter(params, isNotDefaultValue),
  ...objectFilter(extraParams, isNotEmptyParam)
});

/**
 * Checks if a parameter is not empty to avoid adding it to the URL.
 *
 * @param _ - The key parameter (unused).
 * @param value - The value of the key parameter.
 *
 * @returns True if is not empty, False otherwise.
 */
function isNotEmptyParam(_: string | number, value: UrlParamValue | unknown): boolean {
  return Array.isArray(value) ? value.length > 0 : value != null && value !== '';
}

/**
 * Checks if a parameter is not the default state value to avoid adding it to the URL.
 *
 * @param key - The key parameter.
 * @param value - The value of the key parameter.
 *
 * @returns True if is not the default state value, False otherwise.
 */
function isNotDefaultValue(key: string | number, value: UrlParamValue | unknown): boolean {
  return Array.isArray(value) ? value.length > 0 : initialUrlState.params[key] !== value;
}
