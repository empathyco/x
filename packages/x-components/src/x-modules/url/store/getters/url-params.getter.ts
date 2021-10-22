import { objectFilter } from '../../../../utils/object';
import { initialUrlState } from '../initial-state';
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
export const urlParams: UrlXStoreModule['getters']['urlParams'] = state =>
  objectFilter(state, (paramKey, paramValue) => {
    const isInitialParam = paramKey in initialUrlState;
    return (
      (isInitialParam && isNotDefaultValue(paramKey, paramValue)) ||
      (!isInitialParam && isNotEmptyParam(paramValue))
    );
  });

/**
 * Checks if a parameter is not empty to avoid adding it to the URL.
 *
 * @param value - The value of the key parameter.
 *
 * @returns True if is not empty, False otherwise.
 */
function isNotEmptyParam(value: UrlParamValue | unknown): boolean {
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
  return Array.isArray(value) ? value.length > 0 : initialUrlState[key] !== value;
}
