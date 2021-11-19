import { TaggingInfo } from '../../../../../../search-types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { DefaultSessionService } from '../../service';
import { TaggingXStoreModule } from '../types';

/**
 * Default implementation for the {@link TaggingActions.trackTagging}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param taggingInfo - The taggingInfo.
 *
 * @public
 */
export const trackTagging: TaggingXStoreModule['actions']['trackTagging'] = (
  context,
  taggingInfo
) => {
  const consent = context.state.consent;
  const tagging = Array.isArray(taggingInfo) ? taggingInfo : [taggingInfo];

  tagging.forEach(({ url, params }: TaggingInfo) => {
    const sessionId = getSessionId(consent);
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
 * @returns SessionId - The user session id or undefined.
 *
 * @internal
 */
function getSessionId(consent: boolean | null): string | undefined {
  return consent ? DefaultSessionService.instance.getSessionId() : undefined;
}
