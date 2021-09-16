import { forEach } from '../../../../utils/object';
import { Dictionary } from '../../../../utils/types';
import { Params, UrlParamKey, UrlParamValue, UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlActions.updateStoreFromUrl }.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @internal
 */
export const updateStoreFromUrl: UrlXStoreModule['actions']['updateStoreFromUrl'] = ({
  getters: { urlMappedParamNames },
  state: { extraParams, params },
  commit
}) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const mappedParams = {} as Record<keyof Params, UrlParamValue>;
  const mappedExtraParams = {} as Dictionary<UrlParamValue>;
  forEach({ ...params, ...extraParams }, (stateKey, stateValue) => {
    const urlParam = urlMappedParamNames[stateKey];
    if (urlSearchParams.has(urlParam)) {
      const param = getParamByType(urlSearchParams, stateValue, urlParam);

      if (urlParam in extraParams) {
        mappedExtraParams[stateKey] = param;
      } else {
        mappedParams[stateKey] = param;
      }
    }
  });

  commit('setParams', mappedParams);
  commit('setExtraParams', mappedExtraParams);
};

/**
 *
 * Gets the parameter from the url depending on the state parameter type.
 *
 * @param urlSearchParams - All the search params.
 * @param stateValue - Value of the current state.
 * @param urlParam - The param to get.
 *
 * @internal
 *
 * @returns UrlParamValue.
 */
function getParamByType(
  urlSearchParams: URLSearchParams,
  stateValue: UrlParamValue,
  urlParam: UrlParamKey | string
): UrlParamValue {
  switch (typeof stateValue) {
    case 'number':
      return Number(urlSearchParams.get(urlParam));
    case 'boolean':
      return urlSearchParams.get(urlParam)!.toLowerCase() === 'true';
    case 'string':
      return urlSearchParams.get(urlParam)!;
    default:
      // array
      return urlSearchParams.getAll(urlParam);
  }
}
