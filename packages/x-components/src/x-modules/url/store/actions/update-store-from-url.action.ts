import { UrlXStoreModule } from '../types';

const getValues = (params, key: string, configKey?: string): string | string[] => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  if (Array.isArray(params[key])) {
    return urlSearchParams.getAll(key);
  } else {
    return urlSearchParams.get(key);
  }
};

const existsInUrl = (value): boolean => {
  const urlSearchParams = new URLSearchParams(window.location.search);

  return !!urlSearchParams.get(value);
};

/**
 * Default implementation for the {@link UrlActions.updateStoreFromUrl }.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @internal
 */
export const updateStoreFromUrl: UrlXStoreModule['actions']['updateStoreFromUrl'] = ({
  state: {
    config: { urlParamNames },
    extraParams,
    ...params
  },
  commit
}) => {
  Object.entries(params).forEach(([key]) => {
    if (urlParamNames[key] && existsInUrl(urlParamNames[key])) {
      commit(
        `set${key.charAt(0).toUpperCase() + key.slice(1)}`,
        getValues(params, key, urlParamNames[key])
      );
    } else if (params[key] || existsInUrl(key)) {
      commit(`set${key.charAt(0).toUpperCase() + key.slice(1)}`, getValues(params, key));
    } else if (key in extraParams) {
      commit('setExtraParams', { [key]: urlValue });
    }
  });
  /*forEach(urlParamNames, (key, value) => {
   if (Array.isArray(params[key])) {
   debugger;
   commit(
   `set${(key as string).charAt(0).toUpperCase() + (key as string).slice(1)}`,
   urlSearchParams.getAll(value)
   );
   } else {
   commit(
   `set${(key as string).charAt(0).toUpperCase() + (key as string).slice(1)}`,
   urlSearchParams.get(value)
   );
   }
   });*/
  //Buena! Un poco al menos
  /*urlSearchParams.forEach((urlValue, key) => {
   const configParam = Object.keys(urlParamNames).find(
   configKey => urlParamNames[configKey] === key
   );
   debugger;
   if (configParam) {
   commit(`set${configParam.charAt(0).toUpperCase() + configParam.slice(1)}`, urlValue);
   } else if (key in params) {
   commit(`set${key.charAt(0).toUpperCase() + key.slice(1)}`, urlValue);
   } else if (key in extraParams) {
   commit('setExtraParams', { [key]: urlValue });
   }
   });*/
};
