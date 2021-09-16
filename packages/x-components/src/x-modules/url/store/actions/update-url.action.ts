import { Dictionary } from '../../../../utils';
import { forEach, reduce } from '../../../../utils/object';
import { UrlParamValue, UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlActions.updateUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @internal
 */
export const updateUrl: UrlXStoreModule['actions']['updateUrl'] = ({
  getters: { urlParams, urlMappedParamNames }
}) => {
  const url = new URL(window.location.href);
  const oldParams = url.searchParams;

  forEach(urlMappedParamNames, (_, value) => {
    url.searchParams.delete(value);
  });

  reduce(
    urlParams,
    (url, paramKey, paramValue) => {
      const newKey = urlMappedParamNames[paramKey];

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

  if (pushableParamsChanged(urlParams, oldParams)) {
    window.history.pushState({ ...window.history.state }, document.title, url.href);
  } else {
    window.history.replaceState({ ...window.history.state }, document.title, url.href);
  }
};

/**
 * Checks if the pushable params have changed.
 *
 * @param urlParams - The new Url params.
 * @param oldValues - The old Url params.
 *
 * @returns True if the param has changed.
 */
function pushableParamsChanged(
  urlParams: Dictionary<UrlParamValue>,
  oldValues: URLSearchParams
): boolean {
  const pushableParams = ['scroll'];
  return pushableParams.some(key =>
    oldValues.has(key) ? oldValues.get(key) !== urlParams[key] : false
  );
}
