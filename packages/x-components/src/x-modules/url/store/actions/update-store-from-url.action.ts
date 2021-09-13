import { forEach } from '../../../../utils/object';
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
  state: { config, extraParams, params },
  commit
}) => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const mappedParams = {} as Record<UrlParamKey, UrlParamValue>;
  const mappedExtraParams = {} as Record<UrlParamKey, UrlParamValue>;
  forEach({ ...params, ...extraParams }, (stateParam, stateValue) => {
    const urlParam = config.urlParamNames[stateParam] ?? stateParam;
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

// const urlSearchParams = new URLSearchParams(window.location.search);
// forEach({ ...params, ...extraParams }, (stateParam, stateValue) => {
//   const urlParam = config.urlParamNames[stateParam] ?? stateParam;
//   if (urlSearchParams.has(urlParam)) {
//     if (!urlParam in extraParams) {
//       if (Array.isArray(stateValue)) {
//         commit('setRelatedTags', urlSearchParams.getAll(urlParam));
//       } else {
//         commit('setQuery', urlSearchParams.get(urlParam));
//       }
//     } else {
//       if (Array.isArray(stateValue)) {
//         commit('setExtraParams', { [stateParam]: urlSearchParams.getAll(urlParam) });
//       } else {
//         commit('setExtraParams', { [stateParam]: urlSearchParams.get(urlParam) });
//       }
//     }
//   }
// });

// const urlSearchParams = new URLSearchParams(window.location.search);
// forEach({ ...params, ...extraParams }, (stateParam, stateValue) => {
//   const urlParam = config.urlParamNames[stateParam] ?? stateParam;
//   if (urlSearchParams.has(urlParam)) {
//     const payload = Array.isArray(stateValue)
//                     ? { [stateParam]: urlSearchParams.getAll(urlParam) }
//                     : { [stateParam]: urlSearchParams.get(urlParam) };
//
//     const mutation = !(urlParam in extraParams) ? 'setParam' : 'setExtraParams';
//
//     console.log(mutation, payload);
//     commit(mutation, payload);
//   }
// });

// const url = new URL(window.location.href);
// const mappedUrlParams = {} as Record<string, string | string[] | Record<string, string>>;
// url.searchParams.forEach((value, key) => {
//   console.log(`param => ${key}: ${value}`);
//   const [configKeyNew] =
//     Object.entries(config.urlParamNames).find(([, configValue]) => {
//       return configValue === key;
//     }) ?? [];
//   if (configKeyNew) {
//     mappedUrlParams[configKeyNew] = value;
//   } else if (key in params) {
//     mappedUrlParams[key] = value;
//   } else if (key in extraParams) {
//     mappedUrlParams['extraParams'] = { [key]: value };
//   }
// });
// console.log(mappedUrlParams);
