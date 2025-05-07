import type { ExperienceControlsRequest, ExperienceControlsResponse } from '@empathyco/x-types'
import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter'
import { experienceControlsRequestMapper } from '../mappers/requests/experience-controls-request.mapper'
import { experienceControlsResponseMapper } from '../mappers/responses/experience-controls-response.mapper'
import { getConfigServiceUrl, getDefaultHeaders } from './utils'

/**.
 * Default adapter for the experience controls endpoint.
 *
 * @public
 */
export const experienceControlsEndpointAdapter = endpointAdapterFactory<
  ExperienceControlsRequest,
  ExperienceControlsResponse
>({
  endpoint: from => interpolate(`${getConfigServiceUrl(from)}/public/configs`, from),
  requestMapper: experienceControlsRequestMapper,
  responseMapper: experienceControlsResponseMapper,
  defaultRequestOptions: {
    id: 'experience-controls',
    properties: {
      headers: getDefaultHeaders(),
    },
    parameters: {
      service: 'xcontrols',
    },
  },
})
