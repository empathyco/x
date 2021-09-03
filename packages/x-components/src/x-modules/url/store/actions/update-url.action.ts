import { MappedParam, MappedParams, UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlActions.updateUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */
export const updateUrl: UrlXStoreModule['actions']['updateUrl'] = ({
  getters: {
    urlParams: { page, ...params }
  }
}) => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);

  clearUrlParams(url, params);
  urlSetPage(url, page);
  urlSetParams(url, params);

  window.history.replaceState({ ...window.history.state }, document.title, url.href);
};

/**
 * Clears the parameters in the URL.
 *
 * @param url - The current URL.
 * @param mappedParams - The params in {@link UrlXStoreModule.state} mapped with the overridden keys
 * if they are.
 *
 * @public
 * */
function clearUrlParams(url: URL, mappedParams: MappedParams): void {
  for (const mappedParam of Object.values(mappedParams)) {
    url.searchParams.delete(mappedParam.key);
  }
}

/**
 * Sets the page in the URL if the value is greater than 1.
 *
 * @param url - The current URL.
 * @param page - The page param to set in the URL.
 *
 * @public
 * */
function urlSetPage(url: URL, { key, value }: MappedParam): void {
  if (value > 1) {
    url.searchParams.set(key, value.toString());
  }
}

/**
 * Sets the rest of params in the URL depending on if they are an array or a string.
 *
 * @param url - The current URL.
 * @param mappedParams - The params in {@link UrlXStoreModule.state} mapped with the overridden keys
 * if they are.
 *
 * @public
 * */
function urlSetParams(url: URL, mappedParams: MappedParams): void {
  for (const mappedParam of Object.values(mappedParams)) {
    if (Array.isArray(mappedParam.value)) {
      urlSetArray(url, mappedParam);
    } else {
      urlSetString(url, mappedParam);
    }
  }
}

/**
 * Sets the array's values in the URL.
 *
 * @param url - The current url.
 * @param param - The param to set in the url.
 *
 * @public
 * */
function urlSetArray(url: URL, { key, value: values }: MappedParam): void {
  if (Array.isArray(values) && values.length) {
    values.forEach(value => {
      url.searchParams.append(key, value as string);
    });
  }
}

/**
 * Sets the value in the URL.
 *
 * @param url - The current URL.
 * @param param - The param to set in the URL.
 *
 * @public
 * */
function urlSetString(url: URL, { key, value }: MappedParam): void {
  if (value) {
    url.searchParams.set(key, value.toString());
  }
}
