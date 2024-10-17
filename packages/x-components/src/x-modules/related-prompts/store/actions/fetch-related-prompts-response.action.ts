import { RelatedPromptsResponse } from '@empathyco/x-types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { RelatedPromptsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RelatedPromptsActions.fetchRelatedPromptsResponse}.
 *
 * @param _context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The related prompts request to make.
 * @returns The related prompts response.
 */
// eslint-disable-next-line max-len
export const fetchRelatedPromptsResponse: RelatedPromptsXStoreModule['actions']['fetchRelatedPromptsResponse'] =
  (_context, request) => {
    return request
      ? XPlugin.adapter.relatedPrompts(request).then(response => response)
      : ({} as RelatedPromptsResponse);
  };
