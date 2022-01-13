import { TaggingXStoreModule } from '../types';

/**
 * Default implementation for the {@link TaggingActions.trackPDPAddToCart}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param result - The result added to cart.
 *
 * @returns A `void` promise that resolves when the result was tracked.
 *
 * @public
 */
export const trackPDPAddToCart: TaggingXStoreModule['actions']['trackPDPAddToCart'] = (
  { dispatch },
  result
): void | Promise<void> => {
  const taggingInfo = result.tagging.add2cart;
  if (taggingInfo) {
    return dispatch('track', taggingInfo);
  }
};
