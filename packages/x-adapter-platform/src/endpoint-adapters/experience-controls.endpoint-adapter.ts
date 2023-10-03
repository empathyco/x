/* eslint-disable max-len */
import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { ExperienceControlsRequest, ExperienceControlsResponse } from '@empathyco/x-types';
import { experienceControlsRequestMapper } from '../mappers/requests/experience-controls-request.mapper';
import { experienceControlsResponseMapper } from '../mappers/responses/experience-controls-response.mapper';
/* eslint-enable max-len */

/**.
 * Default adapter for the experience controls endpoint.
 *
 * @public
 */
export const experienceControlsEndpointAdapter = endpointAdapterFactory<
  ExperienceControlsRequest,
  ExperienceControlsResponse
>({
  endpoint: 'https://api.{extraParams.env(.)}empathy.co/config/v1/public/configs',
  requestMapper: experienceControlsRequestMapper,
  responseMapper: experienceControlsResponseMapper,
  defaultRequestOptions: {
    id: 'experience-controls',
    parameters: {
      service: 'xcontrols'
    }
  }
});
