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

const invalidUrlValues: Record<string, UrlParamValue> = {
  page: 1
};

function isValidParam(key: string, value: UrlParamValue): boolean {
  return Array.isArray(value)
    ? value.length > 0
    : value != null && value !== '' && value !== invalidUrlValues[key];
}
