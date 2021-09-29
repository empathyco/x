import { ActionsClass } from '../../../../store/actions.types';
import { Dictionary } from '../../../../utils';
import { forEach } from '../../../../utils/object';
import { UrlActionContext, UrlParamKey, UrlParamValue, UrlXStoreModule } from '../types';

export class UpdateUrlAction implements ActionsClass<UrlXStoreModule> {
  /**
   * Default implementation for the {@link UrlActions.updateUrl}.
   *
   * @param context - A {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
   * provided by Vuex.
   *
   * @internal
   */
  updateUrl({ getters: { urlParams, urlMappedParamNames } }: UrlActionContext): void {
    const url = new URL(window.location.href);
    this.deleteUrlParameters(url, urlMappedParamNames);
    this.setUrlParameters(url, urlParams, urlMappedParamNames);
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

  protected setUrlParameters(
    url: URL,
    parameters: Dictionary<UrlParamValue>,
    mappedParameters: Dictionary<UrlParamKey | string>
  ): void {
    forEach(parameters, (paramKey, paramValue) => {
      const newKey = mappedParameters[paramKey];

      if (Array.isArray(paramValue)) {
        paramValue.forEach(value => {
          url.searchParams.append(newKey, value.toString());
        });
      } else {
        url.searchParams.set(newKey, paramValue.toString());
      }
    });
  }
}

// export const updateUrl: UrlXStoreModule['actions']['updateUrl'] = ({
//   getters: { urlParams, urlMappedParamNames }
// }) => {
//   const url = new URL(window.location.href);
//   const oldParams = url.searchParams;
//
//   forEach(urlMappedParamNames, (_, value) => {
//     url.searchParams.delete(value);
//   });
//
//   reduce(
//     urlParams,
//     (url, paramKey, paramValue) => {
//       const newKey = urlMappedParamNames[paramKey];
//
//       if (Array.isArray(paramValue)) {
//         paramValue.forEach(value => {
//           url.searchParams.append(newKey, value.toString());
//         });
//       } else {
//         url.searchParams.set(newKey, paramValue.toString());
//       }
//       return url;
//     },
//     url
//   );
//
//   if (pushableParamsChanged(urlParams, oldParams)) {
//     window.history.pushState({ ...window.history.state }, document.title, url.href);
//   } else {
//     window.history.replaceState({ ...window.history.state }, document.title, url.href);
//   }
// };

// /**
//  * Checks if the pushable params have changed.
//  *
//  * @param urlParams - The new Url params.
//  * @param oldValues - The old Url params.
//  *
//  * @returns True if the param has changed.
//  */
// function pushableParamsChanged(
//   urlParams: Dictionary<UrlParamValue>,
//   oldValues: URLSearchParams
// ): boolean {
//   const pushableParams = ['scroll'];
//   return pushableParams.some(key => oldValues.has(key) && oldValues.get(key) !== urlParams[key]);
// }

const updateUrlAction = new UpdateUrlAction();

// eslint-disable-next-line jsdoc/require-description-complete-sentence
/**
 * {@inheritDoc UpdateUrlAction.updateUrl}
 *
 * @public
 */
export const updateUrl = updateUrlAction.updateUrl.bind(updateUrlAction);
