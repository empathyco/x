import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { ExperienceControlsRequest } from '@empathyco/x-types';
import { experienceControlsRequestMapper } from '../mappers';

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
