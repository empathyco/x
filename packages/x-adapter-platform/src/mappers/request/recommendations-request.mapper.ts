import { combineMappers, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { RecommendationsRequest } from '@empathyco/x-types';
// eslint-disable-next-line max-len
import { recommendationsRequestMutableSchema } from '../../schemas/request/recommendations-request.schema';
import {
  BasePlatformRecommendationsRequest,
  PlatformRecommendationsRequest
} from '../../types/requests/recommendations-request.model';
import { extraParamsRequestMapper } from './extra-params-request.mapper';

export const recommendationsRequestMapper = combineMappers<
  RecommendationsRequest,
  PlatformRecommendationsRequest
>(
  schemaMapperFactory<RecommendationsRequest, BasePlatformRecommendationsRequest>(
    recommendationsRequestMutableSchema
  ),
  extraParamsRequestMapper
);
