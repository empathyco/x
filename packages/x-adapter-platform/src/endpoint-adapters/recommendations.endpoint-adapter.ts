import { endpointAdapterFactory } from '@empathyco/x-adapter-next';
import { RecommendationsRequest, RecommendationsResponse } from '@empathyco/x-types';
import { recommendationsRequestMapper } from '../mappers/request/recommendations-request.mapper';
import { recommendationsResponseMapper } from '../mappers/response/recommendations-response.mapper';

export const recommendationsEndpointAdapter = endpointAdapterFactory<
  RecommendationsRequest,
  RecommendationsResponse
>({
  endpoint: 'https://api.{env(.)}empathy.co/search/v1/query/{instance}/topclicked',
  requestMapper: recommendationsRequestMapper,
  responseMapper: recommendationsResponseMapper
});
