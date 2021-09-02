import { UrlParamKey, UrlParamValue, UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlActions.updateUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const replaceUrl: UrlXStoreModule['actions']['updateUrl'] = ({
  getters: {
    urlParams: { scroll, ...urlParams }
  }
}) => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);

  Object.keys(urlParams).forEach((paramKey: UrlParamKey) => {
    url.searchParams.set(paramKey, encodeURIComponent(urlParams[paramKey]));
  });

  window.history.replaceState({ ...window.history.state, ...urlParams }, document.title, url.href);
};
