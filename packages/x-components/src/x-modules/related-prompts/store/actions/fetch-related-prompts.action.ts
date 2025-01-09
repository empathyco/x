import { XPlugin } from '../../../../plugins/x-plugin';
import { RelatedPromptsXStoreModule } from '../types';

/**
 * Default implementation for the {@link RelatedPromptsActions.fetchRelatedPrompts}.
 *
 * @param _ - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param request - The related prompts request to make.
 * @returns The related prompts response.
 *
 * @public
 */
export const fetchRelatedPrompts: RelatedPromptsXStoreModule['actions']['fetchRelatedPrompts'] = (
  _,
  request
) => {
  return request && request.query !== ''
    ? XPlugin.adapter.relatedPrompts(request).then(({ relatedPrompts }) => relatedPrompts)
    : null;
};
