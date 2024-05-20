import { endpointAdapterFactory, interpolate } from '@empathyco/x-adapter';
import { RecommendationsRequest, RecommendationsResponse } from '@empathyco/x-types';
import { recommendationsRequestMapper } from '../mappers/requests/recommendations-request.mapper';
// eslint-disable-next-line max-len
import { recommendationsResponseMapper } from '../mappers/responses/recommendations-response.mapper';
import { getSearchServiceUrl } from './utils';

/**
 * Default adapter for the recommendations' endpoint.
 *
 * @public
 */
export const recommendationsEndpointAdapter = endpointAdapterFactory<
  RecommendationsRequest,
  RecommendationsResponse
>({
  endpoint: from =>
    interpolate(`${getSearchServiceUrl(from)}/query/{extraParams.instance}/topclicked`, from),
  requestMapper: recommendationsRequestMapper,
  responseMapper: recommendationsResponseMapper,
  defaultRequestOptions: {
    id: 'recommendations',
    parameters: {
      internal: true
    }
  }
});
