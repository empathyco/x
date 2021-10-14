import { UrlParams } from '../../../../types/url-params';
import { forEach } from '../../../../utils/object';
import { Dictionary } from '../../../../utils/types';
import { UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlActions.updateStoreFromUrl }.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param urlParams - The URL params to update the state.
 *
 * @internal
 */
export const updateStoreFromUrl: UrlXStoreModule['actions']['updateStoreFromUrl'] = (
  { state: { params: stateParams }, commit },
  urlParams: UrlParams
) => {
  const params = {} as any;
  const extraParams = {} as Dictionary<unknown>;
  forEach(urlParams, (paramKey, paramValue) => {
    if (paramKey in stateParams) {
      params[paramKey] = paramValue;
    } else {
      extraParams[paramKey] = paramValue;
    }
  });

  commit('setParams', params as UrlParams);
  commit('setExtraParams', extraParams);
};
