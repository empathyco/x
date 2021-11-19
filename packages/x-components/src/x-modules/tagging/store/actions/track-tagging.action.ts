import { TaggingInfo } from '../../../../../../search-types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { DefaultSessionService } from '../../service';
import { TaggingXStoreModule } from '../types';

/**
 * Default implementation for the {@link TaggingActions.trackQueryTagging}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param taggingInfos - The taggingInfo.
 *
 * @public
 */
export const trackTagging: TaggingXStoreModule['actions']['trackTagging'] = (
  context,
  taggingInfos
) => {
  const consent = context.state.consent;
  const sessionId = getSessionId(consent);
  const tagging = Array.isArray(taggingInfos) ? taggingInfos : [taggingInfos];

  tagging.forEach(({ url, params }: TaggingInfo) => {
    return XPlugin.adapter.track({
      url,
      params: {
        ...params,
        session: sessionId
      }
    });
  });
};

/**
 * Returns the session id if the consent is true.
 *
 * @param consent - User consent to get the getSessionId.
 *
 * @returns SessionId - The user session id.
 *
 * @internal
 */
function getSessionId(consent: boolean | null): string | undefined {
  return consent ? DefaultSessionService.instance.getSessionId() : undefined;
}
