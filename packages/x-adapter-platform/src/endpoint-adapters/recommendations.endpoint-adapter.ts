import { endpointAdapterFactory } from '@empathyco/x-adapter';
import { RecommendationsRequest, RecommendationsResponse } from '@empathyco/x-types';
import { recommendationsRequestMapper } from '../mappers/requests/recommendations-request.mapper';
// eslint-disable-next-line max-len
import { recommendationsResponseMapper } from '../mappers/responses/recommendations-response.mapper';

export const recommendationsEndpointAdapter = endpointAdapterFactory<
  RecommendationsRequest,
  RecommendationsResponse
>({
  endpoint:
    'https://api.{extraParams.env(.)}empathy.co/search/v1/query/{extraParams.instance}/topclicked',
  requestMapper: recommendationsRequestMapper,
  responseMapper: recommendationsResponseMapper,
  defaultRequestOptions: {
    id: 'recommendations'
  }
});
