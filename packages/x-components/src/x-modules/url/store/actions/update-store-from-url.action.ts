import { forEach } from '../../../../utils/object';
import { Dictionary } from '../../../../utils/types';
import { UrlParamKey, UrlParamValue, UrlXStoreModule } from '../types';

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
  const mappedParams = {} as Dictionary<UrlParamValue>;
  const mappedExtraParams = {} as Dictionary<UrlParamValue>;
  forEach({ ...params, ...extraParams }, (stateParam, stateValue) => {
    const urlParam = urlMappedParamNames[stateParam];
    if (urlSearchParams.has(urlParam)) {
      const param = getParamByType(urlSearchParams, stateValue, urlParam);

      if (urlParam in extraParams) {
        mappedExtraParams[stateParam] = param;
      } else {
        mappedParams[stateParam] = param;
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
 * @param urlSearchParams - All the search params
 * @param stateValue - Value of the current state
 * @param urlParam - The param to get
 *
 * @internal
 *
 * @returns UrlParamValue
 */
function getParamByType(
  urlSearchParams: URLSearchParams,
  stateValue: UrlParamValue,
  urlParam: UrlParamKey
): UrlParamValue {
  switch (typeof stateValue) {
    case 'number':
      return Number(urlSearchParams.get(urlParam));
    case 'boolean':
      return (urlSearchParams.get(urlParam) as string).toLowerCase() === 'true';
    case 'string':
      return urlSearchParams.get(urlParam) as string;
    default:
      //array
      return urlSearchParams.getAll(urlParam);
  }
}
