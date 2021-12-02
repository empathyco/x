import { TaggingInfo } from '@empathyco/x-types';
import { XPlugin } from '../../../../plugins/x-plugin';
import { DefaultSessionService } from '../../service';
import { TaggingXStoreModule } from '../types';

/**
 * Default implementation for the {@link TaggingActions.track}.
 *
 * @param context - The {@link https://vuex.vuejs.org/guide/actions.html | context} of the actions,
 * provided by Vuex.
 * @param taggingInfo - The information of the event to track.
 *
 * @public
 */
export const track: TaggingXStoreModule['actions']['track'] = ({ state }, taggingInfo) => {
  const { consent } = state;
  const tagging = Array.isArray(taggingInfo) ? taggingInfo : [taggingInfo];
  const sessionId = getSessionId(consent);
  // TODO EX-5061 - Remove this validation when the adapter ignores undefined values.
  const session = sessionId && { session: sessionId };

  tagging.forEach(tagging => {
    if (tagging) {
      const { url, params }: TaggingInfo = tagging;
      XPlugin.adapter.track({
        url,
        params: {
          ...params,
          ...session
        }
      });
    }
  });
};

/**
 * Returns the session id if the consent is true.
 *
 * @param consent - User consent to retrieve the session id.
 *
 * @returns The user session id or undefined.
 *
 * @internal
 */
function getSessionId(consent: boolean | null): string | undefined {
  return consent ? DefaultSessionService.instance.getSessionId() : undefined;
}
