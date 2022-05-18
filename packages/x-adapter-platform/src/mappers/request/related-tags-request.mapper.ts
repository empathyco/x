import { combineMappers, schemaMapperFactory } from '@empathyco/x-adapter-next';
import { RelatedTagsRequest } from '@empathyco/x-types';
import { relatedTagsRequestMutableSchema } from '../../schemas/request/related-tags-request.schema';
import {
  BasePlatformRelatedTagsRequest,
  PlatformRelatedTagsRequest
} from '../../types/requests/related-tags-request.model';
import { extraParamsRequestMapper } from './extra-params-request.mapper';

export const relatedTagsRequestMapper = combineMappers<
  RelatedTagsRequest,
  PlatformRelatedTagsRequest
>(
  schemaMapperFactory<RelatedTagsRequest, BasePlatformRelatedTagsRequest>(
    relatedTagsRequestMutableSchema
  ),
  extraParamsRequestMapper
);
