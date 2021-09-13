import { forEach, reduce } from '../../../../utils/object';
import { UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlActions.updateUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @internal
 */
export const updateUrl: UrlXStoreModule['actions']['updateUrl'] = ({
  getters: { urlParams, urlMappedParamNames },
  state: {
    config: { urlParamNames }
  }
}) => {
  const url = new URL(window.location.href);
  forEach(urlMappedParamNames, (_, value) => {
    url.searchParams.delete(value);
  });

  reduce(
    urlParams,
    (url, paramKey, paramValue) => {
      const newKey = urlParamNames[paramKey] ?? paramKey;

      if (Array.isArray(paramValue)) {
        paramValue.forEach(value => {
          url.searchParams.append(newKey, value.toString());
        });
      } else {
        url.searchParams.set(newKey, paramValue.toString());
      }
      return url;
    },
    url
  );
  window.history.replaceState({ ...window.history.state }, document.title, url.href);
};
