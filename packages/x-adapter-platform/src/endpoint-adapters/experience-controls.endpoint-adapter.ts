import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { ExperienceControlsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { experienceControlsRequestMapper } from '../mappers/requests/experience-controls-request.mapper';

/**.
 * Default adapter for the experience controls endpoint.
 *
 * TODO: change ResponseMapper
 *
 * @public
 */
export const experienceControlsEndpointAdapter = endpointAdapterFactory<
  ExperienceControlsRequest,
  any
>({
  endpoint: 'https://config-service.internal.test.empathy.co/public/configs',
  requestMapper: experienceControlsRequestMapper,
  responseMapper: undefined,
  defaultRequestOptions: {
    id: 'experience-controls',
    parameters: {
      service: 'xcontrols'
    }
  }
});
