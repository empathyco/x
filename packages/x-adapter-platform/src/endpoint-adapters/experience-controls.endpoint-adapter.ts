import { endpointAdapterFactory } from '@empathyco/x-adapter';
// eslint-disable-next-line max-len
import { ExperienceControlsRequest } from '../../../x-types/src/request/experience-controls-request.model';

/**.
 * Default adapter for the experience controls endpoint.
 *
 * TODO: change RequestMapper and ResponseMapper
 *
 * @public
 */
export const experienceControlsEndpointAdapter = endpointAdapterFactory<
  ExperienceControlsRequest,
  any
>({
  endpoint:
    'https://config-service.internal.test.empathy.co/public/configs' +
    '?service=xcontrols&instance={extraParams.instance}',
  requestMapper: undefined,
  responseMapper: undefined,
  defaultRequestOptions: {
    id: 'experience-controls',
    parameters: {
      internal: true
    }
  }
});
