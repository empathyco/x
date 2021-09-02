import { UrlXStoreModule } from '../types';

/**
 * Default implementation for the {@link UrlActions.updateUrl}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 *
 * @public
 */
// eslint-disable-next-line max-len
export const updateUrl: UrlXStoreModule['actions']['updateUrl'] = ({ getters }) => {
  debugger;
  window.history.replaceState({ ...getters.urlParams }, 'guille');
};
