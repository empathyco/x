import { MappedParam, MappedParams, UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlActions.updateUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */

// eslint-disable-next-line max-len
export const updateUrl: UrlXStoreModule['actions']['updateUrl'] = ({
  getters: {
    urlParams: { page, ...params }
  }
}) => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);

  clearUrlParams(url, Object.keys({ page, ...params }));
  urlSetPage(url, page);
  urlSetParams(url, params);

  window.history.replaceState({ ...window.history.state }, document.title, url.href);
};

function clearUrlParams(url: URL, paramsKeys: string[]): void {
  paramsKeys.forEach(paramKey => {
    url.searchParams.delete(paramKey);
  });
}

function urlSetPage(url: URL, { key, value }: MappedParam): void {
  if (value !== 1) {
    url.searchParams.set(key, value.toString());
  }
}

function urlSetString(url: URL, { key, value }: MappedParam): void {
  if (value) {
    url.searchParams.set(key, value.toString());
  }
}

function urlSetArray(url: URL, { key, value: valArr }: MappedParam): void {
  if (Array.isArray(valArr) && valArr.length) {
    valArr.forEach(val => {
      url.searchParams.append(key, val as string);
    });
  }
}

function urlSetParams(url: URL, mappedParams: MappedParams): void {
  for (const mappedParam of Object.values(mappedParams)) {
    if (Array.isArray(mappedParam.value)) {
      urlSetArray(url, mappedParam);
    } else {
      urlSetString(url, mappedParam);
    }
  }
}
