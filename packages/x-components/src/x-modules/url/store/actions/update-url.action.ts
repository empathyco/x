import { ActionsClass } from '../../../../store/actions.types';
import { Dictionary } from '../../../../utils';
import { forEach } from '../../../../utils/object';
import { UrlActionContext, UrlParamKey, UrlParamValue, UrlXStoreModule } from '../types';

/**
 * Class implementation for the {@link UpdateUrlAction.updateUrl} action.
 *
 * @public
 */
export class UpdateUrlAction implements ActionsClass<UrlXStoreModule> {
  /**
   * Default implementation for the {@link UrlActions.updateUrl}.
   *
   * @param context - A {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
   * provided by Vuex.
   *
   * @internal
   */
  updateUrl({
    getters: {
      urlParams: { isLoadedFromUrl, ...parameters },
      urlMappedParamNames
    }
  }: UrlActionContext): void {
    const url = new URL(window.location.href);
    const currentParams = url.searchParams;

    this.deleteUrlParameters(url, urlMappedParamNames);
    this.setUrlParameters(url, parameters, urlMappedParamNames);

    if (this.pushableParamsChanged(parameters, currentParams)) {
      window.history.pushState({ ...window.history.state }, document.title, url.href);
    } else {
      window.history.replaceState({ ...window.history.state }, document.title, url.href);
    }
  }

  /**
   * Deletes all the parameters in the current Url.
   *
   * @param url - The current URL.
   * @param parameters - The list of parameters to be deleted.
   * @internal
   * **/
  protected deleteUrlParameters(url: URL, parameters: Dictionary<UrlParamKey | string>): void {
    forEach(parameters, (_, value) => {
      url.searchParams.delete(value);
    });
  }

  /**
   * Set all the provided parameters to the url with the mapped key.
   *
   * @param url - The current URL.
   * @param parameters - The list of parameters to be deleted.
   * @param mappedParameters - The parameter keys to be set in the url.
   * @internal
   * **/
  protected setUrlParameters(
    url: URL,
    parameters: Dictionary<UrlParamValue>,
    mappedParameters: Dictionary<UrlParamKey | string>
  ): void {
    forEach(parameters, (paramKey, paramValue) => {
      const urlParamKey = mappedParameters[paramKey];

      if (Array.isArray(paramValue)) {
        paramValue.forEach(value => {
          url.searchParams.append(urlParamKey, value.toString());
        });
      } else {
        url.searchParams.set(urlParamKey, paramValue.toString());
      }
    });
  }

  /**
   * Checks if the pushable params have changed.
   *
   * @param urlParams - The new Url params.
   * @param oldValues - The old Url params.
   * @internal
   * @returns True if some of the parameters has changed.
   */
  protected pushableParamsChanged(
    urlParams: Dictionary<UrlParamValue>,
    oldValues: URLSearchParams
  ): boolean {
    const pushableParams: UrlParamKey[] = ['scroll'];
    return pushableParams.some(key => oldValues.has(key) && oldValues.get(key) !== urlParams[key]);
  }
}

const updateUrlAction = new UpdateUrlAction();

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc UpdateUrlAction.updateUrl}
 *
 * @public
 */
export const updateUrl = updateUrlAction.updateUrl.bind(updateUrlAction);
